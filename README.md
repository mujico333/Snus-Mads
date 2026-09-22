# SnusMads

Sitio web estático para una tienda de venta de snus (sin backend, listo para desplegar en cualquier hosting estático — GitHub Pages, Netlify, Vercel, etc.).

## Estructura

- `index.html` — Página principal con catálogo de productos, filtros por categoría y verificación de edad (18+).
- `carrito.html` — Carrito de compra (persistido en `localStorage`).
- `pago.html` — Formulario de datos de envío y selección de método de pago (transferencia / contra reembolso). No recoge datos de tarjeta.
- `contacto.html` — Formulario de contacto.
- `sobre-nosotros.html` — Información sobre el negocio.
- `styles.css` — Estilos generales (tema oscuro/dorado).
- `script.js` — Catálogo de productos, lógica de carrito, filtros, formularios y verificación de edad.

## Cómo probarlo localmente

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000` en el navegador.

## Notas

- Los productos y precios se definen en `script.js` (constante `PRODUCTOS`); edítalos para ajustar tu catálogo real.
- Las imágenes usan un servicio de placeholders (`placehold.co`); sustitúyelas por fotos reales en una carpeta `images/`.
- El pago es un formulario informativo: no procesa pagos reales. Para cobros reales se necesita integrar una pasarela de pago (Stripe, Redsys, etc.) con un backend.
