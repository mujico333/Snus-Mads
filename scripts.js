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

function sendToGoogleSheets(product, quantity, price) {
    let name = localStorage.getItem("userName");
    let card = localStorage.getItem("userCard");
    
    if (!name || !card) {
        alert("Debes iniciar sesión antes de comprar.");
        return;
    }
    
    let formURL = "AQUÍ_VA_EL_ENLACE_DE_TU_FORMULARIO";
    let formData = new FormData();
    formData.append("entry.123456789", name); // Reemplaza con tu entry ID
    formData.append("entry.987654321", card); // Reemplaza con tu entry ID
    formData.append("entry.456789123", product); // Reemplaza con tu entry ID
    formData.append("entry.789123456", quantity); // Reemplaza con tu entry ID
    formData.append("entry.111222333", price); // Reemplaza con tu entry ID
    
    fetch(formURL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).then(() => {
        alert("Pedido enviado correctamente.");
    }).catch(error => console.error("Error enviando datos:", error));
}

// Evento para capturar la compra
document.querySelectorAll(".buy-button").forEach(button => {
    button.addEventListener("click", function () {
        let product = this.dataset.product;
        let quantity = this.previousElementSibling.value;
        let price = this.dataset.price;
        sendToGoogleSheets(product, quantity, price);
    });
});

// Simulación de base de datos de productos
const products = [
    { name: "Snus X", price: "5€", image: "img/snus1.jpg" },
    { name: "Snus Y", price: "6€", image: "img/snus2.jpg" },
    { name: "Snus Z", price: "7€", image: "img/snus3.jpg" }
];

const productContainer = document.getElementById("product-list");
products.forEach(product => {
    let productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Precio: ${product.price}</p>
        <select>
            <option value="1">1 unidad</option>
            <option value="2">2 unidades</option>
            <option value="5">5 unidades</option>
            <option value="10">10 unidades</option>
        </select>
        <button class="buy-button" data-product="${product.name}" data-price="${product.price}">Comprar</button>
    `;
    productContainer.appendChild(productElement);
});
