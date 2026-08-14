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
