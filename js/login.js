const toggle = document.getElementById("togglePassword");
const password = document.getElementById("pass");

if (toggle && password) {

    toggle.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            toggle.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            password.type = "password";

            toggle.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

}
