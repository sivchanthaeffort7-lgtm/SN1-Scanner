function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        sidebar.classList.toggle("collapsed");
    }
}

// ==========================================
// SN1 - MONTHLY COUNT
// MONTH + YEAR SELECTOR
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const monthSelect = document.getElementById("countMonth");

    // Stop if Monthly Count page is not loaded
    if (!monthSelect) return;


    // ------------------------------------------
    // Khmer Month Names
    // ------------------------------------------

    const monthNames = [
        "មករា",
        "កុម្ភៈ",
        "មីនា",
        "មេសា",
        "ឧសភា",
        "មិថុនា",
        "កក្កដា",
        "សីហា",
        "កញ្ញា",
        "តុលា",
        "វិច្ឆិកា",
        "ធ្នូ"
    ];


    // ------------------------------------------
    // Current Year
    // ------------------------------------------

    const currentYear = new Date().getFullYear();


    // ------------------------------------------
    // Create Month + Year Options
    // ------------------------------------------

    for (let year = currentYear; year <= currentYear + 1; year++) {

        for (let month = 11; month >= 0; month--) {

            const option = document.createElement("option");

            const monthNumber = String(month + 1).padStart(2, "0");

            // Example: 2026-08
            option.value = year + "-" + monthNumber;
            // Example: សីហា 2026
            option.textContent = monthNames[month] + " " + year;

            monthSelect.appendChild(option);
        }
    }

});
// ==========================================
// SN1 - MONTHLY COUNT STORAGE
// ==========================================

const MONTHLY_COUNT_STORAGE = "SN1_MONTHLY_COUNT_DATA";


// ==========================================
// GET MONTHLY DATA
// ==========================================

function getMonthlyCountData() {

    const savedData = localStorage.getItem(MONTHLY_COUNT_STORAGE);

    if (!savedData) {
        return {};
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        console.error("Monthly Count data error:", error);
        return {};
    }
}


// ==========================================
// SAVE MONTHLY DATA
// ==========================================

function saveMonthlyCountData(data) {

    localStorage.setItem(
        MONTHLY_COUNT_STORAGE,
        JSON.stringify(data)
    );
}


// ==========================================
// GET CURRENT MONTH KEY
// ==========================================

function getSelectedMonthKey() {

    const monthSelect = document.getElementById("countMonth");

    if (!monthSelect) {
        return null;
    }

    return monthSelect.value || null;
}
// ==========================================
// GET MONTHLY HISTORY FROM GOOGLE SHEET
// ==========================================

async function loadMonthlyHistoryFromSheet() {

    try {

        const form = new FormData();

        form.append("action", "getMonthlyHistory");

        const response = await fetch("/api", {
            method: "POST",
            body: form
        });

        const result = await response.json();

        if (!result.success) {
            console.error(
                "Monthly History API Error:",
                result.message
            );
            return [];
        }

        return result.history || [];

    } catch (error) {

        console.error(
            "Monthly History Fetch Error:",
            error
        );

        return [];
    }
}
// ==========================================
// BUILD MONTHLY DATA FROM GOOGLE SHEET
// ==========================================

function buildMonthlyDataFromSheet(history, monthKey) {

    const monthData = {
        machines: [],
        dateBlocks: {}
    };

    history.forEach(function(item) {

        let date = String(item.date || "").trim();

        // Convert Google Sheet date to YYYY-MM-DD
        if (date.includes("T")) {
            date = date.substring(0, 10);
        }

        // Support DD/MM/YYYY
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {

            const parts = date.split("/");

            date =
                parts[2] + "-" +
                parts[1] + "-" +
                parts[0];
        }

        // Only selected month
        if (!date.startsWith(monthKey)) {
            return;
        }

        const machineID =
            String(item.machineID || "")
                .trim()
                .toUpperCase();

        if (!machineID) {
            return;
        }

        // Prevent duplicate display
        if (!monthData.machines.includes(machineID)) {
            monthData.machines.push(machineID);
        }

        // Create date block
        if (!monthData.dateBlocks[date]) {

            monthData.dateBlocks[date] = {
                machines: []
            };
        }

        if (
            !monthData.dateBlocks[date].machines.includes(machineID)
        ) {
            monthData.dateBlocks[date].machines.push(machineID);
        }

    });

    return monthData;
}
// =====================================================
// SN1 - MONTHLY COUNT CAMERA SCANNER
// Scan QR → Get Machine ID only
// =====================================================

let monthlyScanner = null;

function startMonthlyScanner() {

    const scannerArea = document.getElementById("scannerArea");

    if (!scannerArea) {
        console.error("scannerArea not found");
        return;
    }

    scannerArea.style.display = "block";

    if (monthlyScanner) {
        return;
    }

    monthlyScanner = new Html5Qrcode("scannerArea");

    monthlyScanner.start(
        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: {
                width: 300,
                height: 300
            },
            aspectRatio: 1.0
        },

        function(decodedText) {

            const text = String(decodedText).trim();

            // Get Machine ID only
            const match = text.match(/\b[A-Z0-9]+\-\d+\b/i);

            if (!match) {
                return;
            }

            const machineID = match[0].toUpperCase();

            // Show scanned ID immediately
            addMonthlyScannedMachine(machineID);

            stopMonthlyScanner();
        },

        function(errorMessage) {
            // Ignore continuous scanning errors
        }
    ).catch(function(error) {

        console.error("Monthly Camera error:", error);

        monthlyScanner = null;
        scannerArea.style.display = "none";
    });
}


function stopMonthlyScanner() {

    if (!monthlyScanner) {
        document.getElementById("scannerArea").style.display = "none";
        return;
    }

    monthlyScanner.stop()
        .then(function() {

            monthlyScanner.clear();
            monthlyScanner = null;

            document.getElementById("scannerArea").style.display = "none";
        })
        .catch(function() {

            monthlyScanner = null;
            document.getElementById("scannerArea").style.display = "none";
        });
}


// =====================================================
// Add scanned Machine ID to Monthly List
// =====================================================

function addMonthlyScannedMachine(machineID) {

    const list = document.getElementById("scannedMachineList");

    if (!list) {
        console.error("scannedMachineList not found");
        return;
    }

    const monthKey = getSelectedMonthKey();

    if (!monthKey) {
        alert("សូមជ្រើសខែ និងឆ្នាំសិន");
        return;
    }

    // ==========================================
    // GET SELECTED SCAN DATE
    // ==========================================

    const dateInput = document.getElementById("countDate1");

    if (!dateInput || !dateInput.value) {
        alert("សូមជ្រើសថ្ងៃស្កេនសិន");
        return;
    }

    const scanDate = dateInput.value;

    machineID = String(machineID)
        .trim()
        .toUpperCase();

    if (!machineID) {
        return;
    }


    // ==========================================
    // GET MONTHLY DATA
    // ==========================================

    const data = getMonthlyCountData();


    // ==========================================
    // CREATE MONTH IF NOT EXISTS
    // ==========================================

    if (!data[monthKey]) {

        data[monthKey] = {
            dateBlocks: {},
            machines: []
        };
    }


    // Make sure old data has machines array
    if (!Array.isArray(data[monthKey].machines)) {
        data[monthKey].machines = [];
    }


    // Make sure dateBlocks exists
    if (!data[monthKey].dateBlocks) {
        data[monthKey].dateBlocks = {};
    }


    // ==========================================
    // 🔒 PREVENT DUPLICATE IN SAME MONTH
    // ==========================================

    if (data[monthKey].machines.includes(machineID)) {

        console.log(
            "Machine already counted this month:",
            machineID
        );

        renderMonthlyCount();

        return;
    }


    // ==========================================
    // CREATE SELECTED DATE BLOCK
    // ==========================================

    if (!data[monthKey].dateBlocks[scanDate]) {

        data[monthKey].dateBlocks[scanDate] = {
            machines: []
        };
    }


    const dateBlock =
        data[monthKey].dateBlocks[scanDate];


    // ==========================================
    // ADD MACHINE TO MONTH
    // ==========================================

    data[monthKey].machines.push(machineID);


    // ==========================================
    // ADD MACHINE TO ACTUAL SCAN DATE
    // ==========================================

    dateBlock.machines.push(machineID);


    // ==========================================
    // SAVE
    // ==========================================

    saveMonthlyCountData(data);

// =========================
// SAVE TO GOOGLE SHEET
// =========================

const API_URL = "https://script.google.com/macros/s/AKfycbzDMYa0DttaLXrVscufwKhMNoJyNqORRL58EQzMmT0MB-UKQYR2IeRKA-qhnkaGG5Wt/exec";

fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain;charset=utf-8"
  },
  body: JSON.stringify({
    action: "saveMonthlyCount",
    machineID: machineID,
    countDate: scanDate,
    countedBy: localStorage.getItem("SN1User") || ""
  })
})
.then(response => response.json())
.then(result => {

  if (result.duplicate) {
    console.log("Machine already counted in Google Sheet:", machineID);
    return;
  }

  if (result.success) {
    console.log("Monthly count saved to Google Sheet:", machineID);
  } else {
    console.error("Monthly count failed:", result.message);
  }

})
.catch(error => {
  console.error("Monthly Count API Error:", error);
});
    
    // ==========================================
    // REFRESH DISPLAY
    // ==========================================

    renderMonthlyCount();


    console.log(
        "Monthly scan saved:",
        monthKey,
        scanDate,
        machineID
    );
}

// =========================================================
// SN1 - MONTHLY COUNT DISPLAY
// =========================================================

async function renderMonthlyCount() {

    const monthKey = getSelectedMonthKey();

    const list =
        document.getElementById("scannedMachineList");

    const scannedCount =
        document.getElementById("scannedCount");

    const totalCount =
        document.getElementById("totalCount");

    if (!list) {
        return;
    }

    list.innerHTML = "";


    // ==========================================
    // NO MONTH
    // ==========================================

    if (!monthKey) {

        if (scannedCount) {
            scannedCount.textContent = "0";
        }

        if (totalCount) {
            totalCount.textContent = "0";
        }

        return;
    }


    // ==========================================
    // GET MONTH DATA
    // ==========================================

    const history = await loadMonthlyHistoryFromSheet();

const sheetMonthData =
    buildMonthlyDataFromSheet(history, monthKey);

const monthData = sheetMonthData;
    if (!monthData) {

        if (scannedCount) {
            scannedCount.textContent = "0";
        }

        if (totalCount) {
            totalCount.textContent = "0";
        }

        return;
    }


    // ==========================================
    // MONTHLY UNIQUE MACHINES
    // ==========================================

    const machines =
        Array.isArray(monthData.machines)
            ? monthData.machines
            : [];


    // ==========================================
    // ① SUMMARY BY MACHINE TYPE
    // ==========================================

    const typeCounts = {};


    machines.forEach(function(machineID) {

        const type = String(machineID)
            .split("-")[0]
            .trim()
            .toUpperCase();

        if (!type) {
            return;
        }

        if (!typeCounts[type]) {
            typeCounts[type] = 0;
        }

        typeCounts[type]++;
    });


    // ==========================================
    // DISPLAY TYPE SUMMARY
    // ==========================================

    const summaryContainer =
        document.querySelector(".monthly-summary");


    if (summaryContainer) {

        let summaryHTML = "";

        const types =
            Object.keys(typeCounts).sort();


        types.forEach(function(type) {

            summaryHTML += `
                <div class="summary-row">
                    <span>${type}</span>
                    <strong>${typeCounts[type]}</strong>
                </div>
            `;
        });


        // TOTAL
        summaryHTML += `
            <div class="summary-row summary-total">
                <span>TOTAL</span>
                <strong>${machines.length}</strong>
            </div>
        `;


        summaryContainer.innerHTML =
            summaryHTML;
    }


    // ==========================================
    // ② DAILY DATE BLOCKS
    // ==========================================

    const dateBlocks =
        monthData.dateBlocks || {};


    const dates =
        Object.keys(dateBlocks).sort();


    dates.forEach(function(scanDate) {

        const block =
            dateBlocks[scanDate];


        if (
            !block ||
            !Array.isArray(block.machines) ||
            block.machines.length === 0
        ) {
            return;
        }


        // ======================================
        // DATE BLOCK
        // ======================================

        const dateBlock =
            document.createElement("div");

        dateBlock.className =
            "monthly-date-block";


        // ======================================
        // DATE HEADER
        // ======================================

        const dateHeader =
            document.createElement("div");

        dateHeader.className =
            "monthly-date-header";


        const date =
            new Date(scanDate + "T00:00:00");


        const formattedDate =
            date.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

     dateHeader.innerHTML = `
            <span>📅 ${formattedDate}</span>
            <strong>${block.machines.length}</strong>
        `;


        dateBlock.appendChild(dateHeader);


        // ======================================
        // MACHINE IDS
        // ======================================

        block.machines.forEach(function(machineID) {

            const item =
                document.createElement("div");

            item.className =
                "monthly-machine-item";

            item.textContent =
                machineID;

            dateBlock.appendChild(item);
        });


        list.appendChild(dateBlock);
    });


    // ==========================================
    // UPDATE MAIN COUNTERS
    // ==========================================

    if (scannedCount) {
        scannedCount.textContent =
            machines.length;
    }

    if (totalCount) {
        totalCount.textContent =
            machines.length;
    }
}   

// =========================================================
// MONTH CHANGE
// =========================================================

document.addEventListener("DOMContentLoaded", function() {

    const monthSelect = document.getElementById("countMonth");

    if (!monthSelect) {
        return;
    }

    monthSelect.addEventListener("change", function() {

        renderMonthlyCount();

    });

});

// =========================================================
// MONTHLY COUNT DATES
// =========================================================

document.addEventListener("DOMContentLoaded", function() {

    const date1 = document.getElementById("countDate1");
    const date2 = document.getElementById("countDate2");

    if (!date1 || !date2) {
        return;
    }


    function saveMonthlyDates() {

        const monthKey = getSelectedMonthKey();

        if (!monthKey) {
            return;
        }


        const data = getMonthlyCountData();


        if (!data[monthKey]) {

            data[monthKey] = {
                date1: "",
                date2: "",
                machines: []
            };

        }


        data[monthKey].date1 = date1.value;
        data[monthKey].date2 = date2.value;


        saveMonthlyCountData(data);

    }


    date1.addEventListener("change", saveMonthlyDates);
    date2.addEventListener("change", saveMonthlyDates);

});

// =========================================================
// MACHINE SEARCH
// =========================================================

document.addEventListener("DOMContentLoaded", function() {

    const searchInput = document.getElementById("machineSearch");

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener("input", function() {

        const keyword = searchInput.value
            .trim()
            .toUpperCase();


        const items =
            document.querySelectorAll(
                "#scannedMachineList > div"
            );


        items.forEach(function(item) {

            const machineID =
                item.textContent
                    .trim()
                    .toUpperCase();


            if (machineID.includes(keyword)) {

                item.style.display = "";

            } else {

                item.style.display = "none";

            }

        });

    });

});
