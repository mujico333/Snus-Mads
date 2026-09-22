/* ===== Catálogo de productos ===== */
const PRODUCTOS = [
    { id: 'menta-fuerte', nombre: 'Menta Fuerte', categoria: 'menta', fuerza: 'Fuerte (16mg/g)', precio: 9.90, descripcion: 'Snus de menta intensa y refrescante, larga duración.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Menta+Fuerte' },
    { id: 'menta-suave', nombre: 'Menta Suave', categoria: 'menta', fuerza: 'Suave (8mg/g)', precio: 8.90, descripcion: 'Ideal para empezar, frescor equilibrado y sabor limpio.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Menta+Suave' },
    { id: 'citrico', nombre: 'Cítrico Intenso', categoria: 'citricos', fuerza: 'Media (11mg/g)', precio: 9.50, descripcion: 'Notas de lima y naranja con un toque ácido muy vivo.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=C%C3%ADtrico' },
    { id: 'bayas', nombre: 'Bayas del Bosque', categoria: 'frutal', fuerza: 'Media (11mg/g)', precio: 9.50, descripcion: 'Mezcla dulce de arándanos y frambuesas silvestres.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Bayas' },
    { id: 'original', nombre: 'Original Tabaco', categoria: 'clasico', fuerza: 'Fuerte (18mg/g)', precio: 8.50, descripcion: 'El sabor clásico sueco, robusto y sin aromas añadidos.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Original' },
    { id: 'regaliz', nombre: 'Regaliz Negro', categoria: 'clasico', fuerza: 'Media (12mg/g)', precio: 9.90, descripcion: 'Toque nórdico de regaliz sobre base de tabaco suave.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Regaliz' },
    { id: 'extra-fuerte', nombre: 'White Extra Fuerte', categoria: 'clasico', fuerza: 'Extra Fuerte (22mg/g)', precio: 10.90, descripcion: 'Formato blanco de liberación lenta para paladares expertos.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Extra+Fuerte' },
    { id: 'sandia', nombre: 'Sandía Fresca', categoria: 'frutal', fuerza: 'Suave (8mg/g)', precio: 8.90, descripcion: 'Dulzor veraniego de sandía, muy suave en encía.', img: 'https://placehold.co/300x300/1c211d/d4af37?text=Sand%C3%ADa' }
];

const CART_KEY = 'snusmads_carrito';
const EDAD_KEY = 'snusmads_edad_verificada';

/* ===== Utilidades de carrito (localStorage) ===== */
function getCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;
    const carrito = getCarrito();
    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ id, cantidad: 1 });
    }
    guardarCarrito(carrito);
    mostrarToast(`${producto.nombre} añadido al carrito`);
}

function cambiarCantidad(id, delta) {
    const carrito = getCarrito();
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    let carrito = getCarrito();
    carrito = carrito.filter(i => i.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function totalCarrito() {
    const carrito = getCarrito();
    return carrito.reduce((total, item) => {
        const producto = PRODUCTOS.find(p => p.id === item.id);
        return producto ? total + producto.precio * item.cantidad : total;
    }, 0);
}

function cantidadTotalCarrito() {
    return getCarrito().reduce((t, i) => t + i.cantidad, 0);
}

function actualizarContadorCarrito() {
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cantidadTotalCarrito();
    });
}

function mostrarToast(texto) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#d4af37;color:#111;padding:10px 20px;border-radius:20px;font-weight:bold;z-index:300;transition:opacity 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
        document.body.appendChild(toast);
    }
    toast.textContent = texto;
    toast.style.opacity = '1';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

/* ===== Render página de productos (index.html) ===== */
function renderizarProductos(filtro = 'todos') {
    const contenedor = document.getElementById('productos-lista');
    if (!contenedor) return;
    const lista = filtro === 'todos' ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === filtro);
    contenedor.innerHTML = lista.map(p => `
        <div class="producto">
            <img src="${p.img}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <span class="badge-fuerza">${p.fuerza}</span>
            <p class="descripcion">${p.descripcion}</p>
            <p class="precio">${p.precio.toFixed(2)} €</p>
            <button class="btn-comprar" data-id="${p.id}">Añadir al carrito</button>
        </div>
    `).join('');

    contenedor.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', () => agregarAlCarrito(btn.dataset.id));
    });
}

function inicializarFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    if (!filtros.length) return;
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            renderizarProductos(btn.dataset.filtro);
        });
    });
}

/* ===== Render carrito (carrito.html) ===== */
function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-lista');
    if (!contenedor) return;
    const carrito = getCarrito();
    const resumen = document.getElementById('resumen-carrito');

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. <a href="index.html" style="color:var(--gold)">Ver productos</a></p>';
        if (resumen) resumen.style.display = 'none';
        return;
    }

    if (resumen) resumen.style.display = 'block';

    contenedor.innerHTML = carrito.map(item => {
        const producto = PRODUCTOS.find(p => p.id === item.id);
        if (!producto) return '';
        const subtotal = producto.precio * item.cantidad;
        return `
            <div class="item-carrito">
                <img src="${producto.img}" alt="${producto.nombre}">
                <div class="item-info">
                    <h3>${producto.nombre}</h3>
                    <span class="precio-unit">${producto.precio.toFixed(2)} € / unidad</span>
                </div>
                <div class="cantidad-control">
                    <button data-accion="restar" data-id="${item.id}">−</button>
                    <span>${item.cantidad}</span>
                    <button data-accion="sumar" data-id="${item.id}">+</button>
                </div>
                <div class="item-subtotal">${subtotal.toFixed(2)} €</div>
                <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
            </div>
        `;
    }).join('');

    contenedor.querySelectorAll('[data-accion="sumar"]').forEach(b => b.addEventListener('click', () => cambiarCantidad(b.dataset.id, 1)));
    contenedor.querySelectorAll('[data-accion="restar"]').forEach(b => b.addEventListener('click', () => cambiarCantidad(b.dataset.id, -1)));
    contenedor.querySelectorAll('.btn-eliminar').forEach(b => b.addEventListener('click', () => eliminarDelCarrito(b.dataset.id)));

    const envio = carrito.length > 0 ? 3.95 : 0;
    const total = totalCarrito();
    const subtotalEl = document.getElementById('resumen-subtotal');
    const envioEl = document.getElementById('resumen-envio');
    const totalEl = document.getElementById('resumen-total');
    if (subtotalEl) subtotalEl.textContent = `${total.toFixed(2)} €`;
    if (envioEl) envioEl.textContent = `${envio.toFixed(2)} €`;
    if (totalEl) totalEl.textContent = `${(total + envio).toFixed(2)} €`;
}

/* ===== Render resumen en checkout (pago.html) ===== */
function renderizarResumenPago() {
    const contenedor = document.getElementById('pago-resumen-items');
    if (!contenedor) return;
    const carrito = getCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        const form = document.getElementById('form-pago');
        if (form) form.style.display = 'none';
        return;
    }

    contenedor.innerHTML = carrito.map(item => {
        const producto = PRODUCTOS.find(p => p.id === item.id);
        if (!producto) return '';
        return `<div class="resumen-linea"><span>${producto.nombre} x${item.cantidad}</span><span>${(producto.precio * item.cantidad).toFixed(2)} €</span></div>`;
    }).join('');

    const envio = 3.95;
    const total = totalCarrito();
    contenedor.innerHTML += `
        <div class="resumen-linea"><span>Envío</span><span>${envio.toFixed(2)} €</span></div>
        <div class="resumen-linea total"><span>Total</span><span>${(total + envio).toFixed(2)} €</span></div>
    `;
}

/* ===== Formulario de pago/pedido ===== */
function inicializarFormularioPago() {
    const form = document.getElementById('form-pago');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        localStorage.removeItem(CART_KEY);
        actualizarContadorCarrito();
        form.style.display = 'none';
        const confirmacion = document.getElementById('confirmacion-pedido');
        if (confirmacion) confirmacion.classList.add('visible');
        const resumen = document.getElementById('pago-resumen-container');
        if (resumen) resumen.style.display = 'none';
    });
}

/* ===== Formulario de contacto ===== */
function inicializarFormularioContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        form.style.display = 'none';
        const confirmacion = document.getElementById('confirmacion-contacto');
        if (confirmacion) confirmacion.classList.add('visible');
    });
}

/* ===== Verificación de edad ===== */
function inicializarVerificacionEdad() {
    const popup = document.getElementById('popup');
    if (!popup) return;

    if (localStorage.getItem(EDAD_KEY) === 'si') {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'flex';
    }

    const btnSi = document.getElementById('btn-edad-si');
    const btnNo = document.getElementById('btn-edad-no');

    if (btnSi) btnSi.addEventListener('click', () => {
        localStorage.setItem(EDAD_KEY, 'si');
        popup.style.display = 'none';
    });

    if (btnNo) btnNo.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });
}

/* ===== Menú móvil ===== */
function inicializarMenuMovil() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav-principal');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('abierto'));
}

/* ===== Inicialización general ===== */
document.addEventListener('DOMContentLoaded', () => {
    inicializarVerificacionEdad();
    inicializarMenuMovil();
    actualizarContadorCarrito();
    renderizarProductos();
    inicializarFiltros();
    renderizarCarrito();
    renderizarResumenPago();
    inicializarFormularioPago();
    inicializarFormularioContacto();
});
