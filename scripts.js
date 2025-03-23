document.addEventListener("DOMContentLoaded", function () {
    // Verificación de edad
    if (!localStorage.getItem("ageVerified")) {
        document.getElementById("age-verification").style.display = "flex";
    }
});

function verifyAge(isAdult) {
    if (isAdult) {
        localStorage.setItem("ageVerified", "true");
        document.getElementById("age-verification").style.display = "none";
        document.getElementById("login").style.display = "flex";
    } else {
        alert("No puedes acceder si eres menor de edad.");
        window.location.href = "https://www.google.com";
    }
}

function saveLogin() {
    let name = document.getElementById("name").value;
    let card = document.getElementById("card").value;
    if (name && card) {
        localStorage.setItem("userName", name);
        localStorage.setItem("userCard", card);
        document.getElementById("login").style.display = "none";
    } else {
        alert("Por favor, ingresa todos los datos.");
    }
}
