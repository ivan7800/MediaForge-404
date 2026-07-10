# MediaForge 404 v4.0.2 Web Light

Esta edición está preparada para el cargador web de GitHub. Se han eliminado las dos copias locales de `ffmpeg-core.wasm` (aprox. 32 MB cada una), que superaban el límite de 25 MB por archivo.

## Qué se conserva

- Reproductor, biblioteca, Audio Lab, skins, modos TV y pantalla completa corregida.
- Conversión, reparación y análisis profundo.
- PWA y GitHub Pages.

## Diferencia

FFmpeg se descarga desde unpkg únicamente al abrir una función que lo necesita. Los archivos multimedia no se suben: el procesamiento continúa dentro del navegador. La primera conversión requiere conexión a Internet.
