function goToPage(page) {
    window.location.href = page;
}

function scanMachine() {
    const machineNumber = document.getElementById("machineNumber").value;

    if (machineNumber.trim() === "") {
        alert("សូមបញ្ចូលលេខម៉ាស៊ីនជាមុនសិន");
        return;
    }

    alert("កំពុងស្វែងរកម៉ាស៊ីន: " + machineNumber);
}
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
}
// ==========================================
// MONTHLY COUNT - MONTH & YEAR SELECTOR
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const monthSelect = document.getElementById("countMonth");

    if (!monthSelect) return;

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

    const currentYear = new Date().getFullYear();

    // បង្កើតខែ + ឆ្នាំ
    for (let year = currentYear; year >= currentYear - 1; year--) {

        for (let month = 11; month >= 0; month--) {

            const option = document.createElement("option");

            const monthNumber = String(month + 1).padStart(2, "0");

            option.value = ${year}-${monthNumber};

            option.textContent = ${monthNames[month]} ${year};

            monthSelect.appendChild(option);
        }
    }

});
