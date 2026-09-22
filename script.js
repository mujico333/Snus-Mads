/* ==========================================================================
   SNUS MADS — Lógica de sitio (catálogo, carrito, formularios, edad)
   Sin dependencias externas. Estado del carrito persistido en localStorage.
   ========================================================================== */

const CLAVE_CARRITO = 'snusmads.carrito';
const CLAVE_EDAD = 'snusmads.edadVerificada';
const COSTE_ENVIO = 3.95;

const ICONOS = {
    mas: '<svg class="icono" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    menos: '<svg class="icono" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    papelera: '<svg class="icono" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    check: '<svg class="icono" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>'
};

/* Catálogo — cada producto lleva un color de etiqueta propio (sin imágenes externas) */
const PRODUCTOS = [
    { id: 'menta-glacial', nombre: 'Menta Glacial', categoria: 'menta', iniciales: 'MG', color: '#2b3f31', fuerza: 3, fuerzaTexto: 'Fuerte · 16 mg/g', precio: 9.90, descripcion: 'Mentol intenso y frío, con una liberación limpia y duradera.' },
    { id: 'menta-suave', nombre: 'Menta Suave', categoria: 'menta', iniciales: 'MS', color: '#3d5844', fuerza: 1, fuerzaTexto: 'Suave · 8 mg/g', precio: 8.90, descripcion: 'Frescor equilibrado, ideal para iniciarse en el snus.' },
    { id: 'citrico-lima', nombre: 'Lima & Bergamota', categoria: 'citricos', iniciales: 'LB', color: '#b05e2c', fuerza: 2, fuerzaTexto: 'Media · 11 mg/g', precio: 9.50, descripcion: 'Notas ácidas de lima con un fondo floral de bergamota.' },
    { id: 'citrico-naranja', nombre: 'Naranja Sanguina', categoria: 'citricos', iniciales: 'NS', color: '#c17a3f', fuerza: 2, fuerzaTexto: 'Media · 11 mg/g', precio: 9.50, descripcion: 'Dulzor cítrico intenso con un toque amargo al final.' },
    { id: 'bayas-bosque', nombre: 'Bayas del Bosque', categoria: 'frutal', iniciales: 'BB', color: '#6b3a4a', fuerza: 2, fuerzaTexto: 'Media · 11 mg/g', precio: 9.50, descripcion: 'Arándanos y frambuesas silvestres sobre base suave.' },
    { id: 'sandia', nombre: 'Sandía Fresca', categoria: 'frutal', iniciales: 'SF', color: '#a8402b', fuerza: 1, fuerzaTexto: 'Suave · 8 mg/g', precio: 8.90, descripcion: 'Dulzor veraniego y ligero, muy suave en encía.' },
    { id: 'original', nombre: 'Original Sueco', categoria: 'clasico', iniciales: 'OS', color: '#1f2e24', fuerza: 4, fuerzaTexto: 'Extra fuerte · 18 mg/g', precio: 8.50, descripcion: 'El sabor clásico y robusto, sin aromas añadidos.' },
    { id: 'regaliz', nombre: 'Regaliz Nórdico', categoria: 'clasico', iniciales: 'RN', color: '#2c2a2e', fuerza: 3, fuerzaTexto: 'Fuerte · 14 mg/g', precio: 9.90, descripcion: 'Regaliz negro sobre una base de tabaco profunda.' }
];

/* ==========================================================================
   Carrito — lectura/escritura en localStorage
   ========================================================================== */

function leerCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function escribirCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;
    const carrito = leerCarrito();
    const linea = carrito.find(l => l.id === id);
    if (linea) {
        linea.cantidad += 1;
    } else {
        carrito.push({ id, cantidad: 1 });
    }
    escribirCarrito(carrito);
    mostrarToast(`${producto.nombre} añadido al carrito`);
}

function cambiarCantidad(id, delta) {
    const carrito = leerCarrito();
    const linea = carrito.find(l => l.id === id);
    if (!linea) return;
    linea.cantidad += delta;
    const restante = linea.cantidad > 0 ? carrito : carrito.filter(l => l.id !== id);
    escribirCarrito(restante);
    renderizarCarrito();
}

function quitarDelCarrito(id) {
    escribirCarrito(leerCarrito().filter(l => l.id !== id));
    renderizarCarrito();
}

function totalArticulos() {
    return leerCarrito().reduce((suma, l) => suma + l.cantidad, 0);
}

function subtotalCarrito() {
    return leerCarrito().reduce((suma, l) => {
        const producto = PRODUCTOS.find(p => p.id === l.id);
        return producto ? suma + producto.precio * l.cantidad : suma;
    }, 0);
}

function actualizarContadorCarrito() {
    document.querySelectorAll('[data-contador-carrito]').forEach(el => {
        el.textContent = totalArticulos();
    });
}

/* ==========================================================================
   Notificación flotante
   ========================================================================== */

let temporizadorToast;

function mostrarToast(texto) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `${ICONOS.check}<span data-texto-toast></span>`;
        document.body.appendChild(toast);
    }
    toast.querySelector('[data-texto-toast]').textContent = texto;
    toast.classList.add('visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => toast.classList.remove('visible'), 2200);
}

/* ==========================================================================
   Render — catálogo (index.html)
   ========================================================================== */

function marcadoEtiquetaProducto(producto, tamano = '') {
    return `
        <div class="${tamano === 'pequena' ? 'item-etiqueta' : 'producto-etiqueta'}" style="background:${producto.color}">
            ${tamano === 'pequena' ? '' : `<span class="num">Nº ${PRODUCTOS.indexOf(producto) + 1}</span>`}
            <span class="iniciales">${producto.iniciales}</span>
        </div>
    `;
}

function marcadoPuntosFuerza(nivel) {
    return `<span class="puntos-fuerza">${[1, 2, 3, 4].map(n => `<span class="${n <= nivel ? 'lleno' : ''}"></span>`).join('')}</span>`;
}

function renderizarProductos(filtro = 'todos') {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    const productos = filtro === 'todos' ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === filtro);

    contenedor.innerHTML = productos.map(producto => `
        <article class="producto">
            ${marcadoEtiquetaProducto(producto)}
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <div class="producto-meta">
                ${marcadoPuntosFuerza(producto.fuerza)}
                <span class="texto-fuerza">${producto.fuerzaTexto}</span>
            </div>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <div class="producto-pie">
                <span class="producto-precio">${producto.precio.toFixed(2)} €</span>
                <button class="btn-anadir" data-id="${producto.id}" aria-label="Añadir ${producto.nombre} al carrito">
                    ${ICONOS.mas}
                </button>
            </div>
        </article>
    `).join('');

    contenedor.querySelectorAll('.btn-anadir').forEach(boton => {
        boton.addEventListener('click', () => agregarAlCarrito(boton.dataset.id));
    });
}

function inicializarFiltros() {
    const botones = document.querySelectorAll('.filtro-btn');
    if (!botones.length) return;
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            botones.forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');
            renderizarProductos(boton.dataset.filtro);
        });
    });
}

/* ==========================================================================
   Render — carrito (carrito.html)
   ========================================================================== */

function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    if (!contenedor) return;

    const carrito = leerCarrito();
    const panel = document.getElementById('panel-resumen');
    const vacio = document.getElementById('carrito-vacio');

    if (carrito.length === 0) {
        contenedor.style.display = 'none';
        if (panel) panel.style.display = 'none';
        if (vacio) vacio.style.display = 'block';
        return;
    }

    contenedor.style.display = 'flex';
    if (panel) panel.style.display = 'block';
    if (vacio) vacio.style.display = 'none';

    contenedor.innerHTML = carrito.map(linea => {
        const producto = PRODUCTOS.find(p => p.id === linea.id);
        if (!producto) return '';
        const subtotal = producto.precio * linea.cantidad;
        return `
            <div class="item-carrito">
                ${marcadoEtiquetaProducto(producto, 'pequena')}
                <div class="item-info">
                    <h3>${producto.nombre}</h3>
                    <span class="precio-unidad">${producto.precio.toFixed(2)} € / unidad</span>
                </div>
                <div class="control-cantidad">
                    <button data-accion="restar" data-id="${producto.id}" aria-label="Reducir cantidad">${ICONOS.menos}</button>
                    <span>${linea.cantidad}</span>
                    <button data-accion="sumar" data-id="${producto.id}" aria-label="Aumentar cantidad">${ICONOS.mas}</button>
                </div>
                <span class="item-subtotal">${subtotal.toFixed(2)} €</span>
                <button class="btn-quitar" data-id="${producto.id}" aria-label="Eliminar ${producto.nombre}">${ICONOS.papelera}</button>
            </div>
        `;
    }).join('');

    contenedor.querySelectorAll('[data-accion="sumar"]').forEach(b => b.addEventListener('click', () => cambiarCantidad(b.dataset.id, 1)));
    contenedor.querySelectorAll('[data-accion="restar"]').forEach(b => b.addEventListener('click', () => cambiarCantidad(b.dataset.id, -1)));
    contenedor.querySelectorAll('.btn-quitar').forEach(b => b.addEventListener('click', () => quitarDelCarrito(b.dataset.id)));

    const subtotal = subtotalCarrito();
    const elSubtotal = document.getElementById('resumen-subtotal');
    const elEnvio = document.getElementById('resumen-envio');
    const elTotal = document.getElementById('resumen-total');
    if (elSubtotal) elSubtotal.textContent = `${subtotal.toFixed(2)} €`;
    if (elEnvio) elEnvio.textContent = `${COSTE_ENVIO.toFixed(2)} €`;
    if (elTotal) elTotal.textContent = `${(subtotal + COSTE_ENVIO).toFixed(2)} €`;
}

/* ==========================================================================
   Render — resumen en checkout (pago.html)
   ========================================================================== */

function renderizarResumenPago() {
    const contenedor = document.getElementById('resumen-items-pago');
    if (!contenedor) return;

    const carrito = leerCarrito();
    const formulario = document.getElementById('formulario-pago');

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. <a href="index.html">Ver catálogo</a></p>';
        if (formulario) formulario.style.display = 'none';
        return;
    }

    const subtotal = subtotalCarrito();

    contenedor.innerHTML = carrito.map(linea => {
        const producto = PRODUCTOS.find(p => p.id === linea.id);
        if (!producto) return '';
        return `<div class="linea-resumen"><span>${producto.nombre} × ${linea.cantidad}</span><span>${(producto.precio * linea.cantidad).toFixed(2)} €</span></div>`;
    }).join('') + `
        <div class="linea-resumen"><span>Envío</span><span>${COSTE_ENVIO.toFixed(2)} €</span></div>
        <div class="linea-resumen total"><span>Total</span><span>${(subtotal + COSTE_ENVIO).toFixed(2)} €</span></div>
    `;
}

function inicializarFormularioPago() {
    const formulario = document.getElementById('formulario-pago');
    if (!formulario) return;
    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        localStorage.removeItem(CLAVE_CARRITO);
        actualizarContadorCarrito();
        formulario.style.display = 'none';
        document.getElementById('confirmacion-pago').classList.add('visible');
        document.getElementById('panel-resumen-pago').style.display = 'none';
    });
}

/* ==========================================================================
   Formulario de contacto
   ========================================================================== */

function inicializarFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    if (!formulario) return;
    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        formulario.style.display = 'none';
        document.getElementById('confirmacion-contacto').classList.add('visible');
    });
}

/* ==========================================================================
   Verificación de edad
   ========================================================================== */

function inicializarVerificacionEdad() {
    const popup = document.getElementById('popup-edad');
    if (!popup) return;

    if (localStorage.getItem(CLAVE_EDAD) !== 'si') {
        popup.classList.add('visible');
    }

    document.getElementById('btn-edad-si')?.addEventListener('click', () => {
        localStorage.setItem(CLAVE_EDAD, 'si');
        popup.classList.remove('visible');
    });

    document.getElementById('btn-edad-no')?.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });
}

/* ==========================================================================
   Menú móvil
   ========================================================================== */

function inicializarMenuMovil() {
    const boton = document.getElementById('boton-menu');
    const nav = document.getElementById('nav-principal');
    if (!boton || !nav) return;
    boton.addEventListener('click', () => nav.classList.toggle('abierto'));
}

/* ==========================================================================
   Arranque
   ========================================================================== */

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
