# Snus Mads

Sitio web estático para una tienda de venta de snus, sin dependencias externas de imágenes ni backend — listo para desplegar en cualquier hosting estático (GitHub Pages, Netlify, Vercel...).

## Estética

"Apotecario nórdico": fondo papel crudo, verde pino y acento cobre, tipografía **Fraunces** (display, serif editorial) + **Inter** (texto), rejillas de línea fina, sin iconografía emoji (todo en SVG inline). Las tarjetas de producto usan una etiqueta de color en vez de fotografías, para no depender de imágenes externas.

## Estructura

- `index.html` — Portada: héroe, catálogo con filtros, proceso de compra, franja de garantías.
- `carrito.html` — Carrito de compra (persistido en `localStorage`), con panel de resumen.
- `pago.html` — Datos de envío + método de pago (transferencia / contra reembolso). No recoge datos de tarjeta.
- `contacto.html` — Formulario de contacto + información de contacto.
- `sobre-nosotros.html` — Historia de marca, cifras y valores.
- `styles.css` — Sistema de diseño completo (tokens de color/tipografía, componentes).
- `script.js` — Catálogo de productos, carrito, filtros, formularios y verificación de edad.

## Cómo probarlo localmente

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000` en el navegador.

## Notas

- El catálogo (productos, precios, colores de etiqueta) se define en `script.js` (constante `PRODUCTOS`).
- El pago es un formulario informativo: no procesa pagos reales. Para cobros reales se necesita integrar una pasarela de pago (Stripe, Redsys, etc.) con un backend.
- La tipografía se carga desde Google Fonts (`Fraunces` + `Inter`); si se despliega sin acceso a internet, el sitio recae en las fuentes del sistema definidas como fallback.
