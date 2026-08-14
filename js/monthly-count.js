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

    const item = document.createElement("div");

    item.textContent = machineID;

    list.appendChild(item);

    console.log("Monthly Count scanned:", machineID);
}
