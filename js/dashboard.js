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
