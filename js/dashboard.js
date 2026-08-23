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
function logout() {
    localStorage.removeItem("SN1User");
    localStorage.removeItem("username");

    window.location.href = "login.html";
}

// ======================================================
// SN1 DASHBOARD DATA
// Read-only Dashboard API connection
// DO NOT MODIFY EXISTING FUNCTIONS ABOVE
// ======================================================

async function loadDashboardData() {
    try {
        const response = await fetch('/functions/dashboard');

        if (!response.ok) {
            throw new Error('Dashboard API request failed');
        }

        const data = await response.json();

        // 1. Total
        const total = document.getElementById('dashboardTotal');
        if (total && data.total !== undefined) {
            total.textContent = data.total;
        }

        // 2. Rental
        const rental = document.getElementById('dashboardRental');
        if (rental && data.rental !== undefined) {
            rental.textContent = data.rental;
        }

        // 3. Repair
        const repair = document.getElementById('dashboardRepair');
        if (repair && data.repair !== undefined) {
            repair.textContent = data.repair;
        }

        // 4. Warehouse
        const warehouse = document.getElementById('dashboardWarehouse');
        if (warehouse && data.warehouse !== undefined) {
            warehouse.textContent = data.warehouse;
        }

    } catch (error) {
        console.error('Dashboard API Error:', error);
    }
}

// Load dashboard data when page is ready
window.addEventListener('DOMContentLoaded', loadDashboardData);
