# Casa Quinta Pacheco — Sitio web

## Stack
- HTML + CSS + JS puro: `index.html`, `styles.css` y `script.js`.
- Tipografías: Fraunces (display) y Figtree (texto), de Google Fonts.
- Paleta: Piedra `#F3ECE1`, Noche `#161A2E`, Violeta Pileta `#8A23D6` y Ámbar `#F5B95C` (solo en focos y precios). Ver `../marca/plataforma.md`.

## Qué tiene
- Loader con el foco del logo que se prende.
- Hero con video de presentación (`assets/video/hero-desktop.mp4` para desktop y `hero-mobile.mp4` vertical para celular), con botón de pausa.
- «Un día en Pacheco»: al scrollear va de las 10:00 a la noche, el fondo oscurece y se prende la guirnalda.
- Espacios con nombre propio: La Pileta, El Quincho y El Salón.
- Galería con filtros y lightbox (teclado y swipe).
- Calculadora de precio: fecha (detecta fin de semana), feriado, personas y limpieza. Arma el mensaje de WhatsApp con todo cargado.
- Mapa, CTA final con frase rotativa y botón flotante de WhatsApp.

## Cómo correr localmente
```bash
python3 -m http.server 8080
```
Abrir http://localhost:8080

## Personalizar
- **Precios:** objeto `P` al principio de la sección «Calculadora» en `script.js`, y lista `.tarifas` en `index.html`.
- **WhatsApp:** constante `WA` en `script.js` (`5491126734338`).
- **Video:** reemplazar los mp4 y jpg de `assets/video/`; los generó un script de ffmpeg a partir de las fotos.
- **Fotos:** `assets/fotos/` (máximo 1600 px). Faltan fotos de día (cocina, baño, parrilla prendida).

## Deploy
Subir la carpeta `web/` tal cual a Vercel, Netlify o GitHub Pages.
