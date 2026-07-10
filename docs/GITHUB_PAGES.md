# Publicar MediaForge 404 v4.1.0 en GitHub Pages

Esta edición Web Light puede subirse desde el navegador: ningún archivo supera 25 MB.

1. Crea un repositorio.
2. Pulsa `Add file → Upload files`.
3. Sube todos los archivos y carpetas del proyecto, no el ZIP.
4. Confirma el commit.
5. Abre `Settings → Pages`.
6. Selecciona `Deploy from a branch`, `main` y `/(root)`.

GitHub Pages proporciona HTTPS, necesario para PWA y recomendado para Google Cast.

## Comprobación

- `index.html` debe estar en la raíz.
- Las carpetas `assets`, `icons` y `cast-bridge` deben existir.
- `manifest.webmanifest` y `sw.js` deben devolver HTTP 200.
- Haz `Ctrl + F5` tras actualizar para evitar una caché antigua.

## Dependencias bajo demanda

- Google Cast SDK: `www.gstatic.com`.
- FFmpeg Core: `unpkg.com`.

La reproducción normal no necesita descargar FFmpeg.
