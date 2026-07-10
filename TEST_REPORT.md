# Informe de pruebas — MediaForge 404 v4.0.1

## Superadas
- `npm ci`: correcto.
- `npm audit`: 0 vulnerabilidades conocidas.
- `npm run build`: correcto.
- FFmpeg Core copiado y empaquetado localmente.
- Service worker generado con recursos de interfaz.
- Recursos `manifest.webmanifest`, `sw.js`, `vendor/ffmpeg/ffmpeg-core.js` y `ffmpeg-core.wasm`: presentes.
- Revisión estática de rutas relativas: correcta.
- Prueba Playwright específica de fullscreen: incorporada al proyecto.

## Limitación del entorno
Playwright pudo iniciar Chromium del sistema, pero la política administrativa bloqueó el acceso a `http://127.0.0.1:4173` con `ERR_BLOCKED_BY_ADMINISTRATOR`. Por ello no se afirma falsamente que toda la suite E2E haya pasado.

## Caso fullscreen verificado por código
- Contenedor fullscreen: 100vw × 100vh / 100dvh.
- Sin `aspect-ratio` ni `max-height`.
- Sin bordes, radios, sombras o filtros.
- Vídeo: ocupa el viewport completo con `object-fit: contain`.
- Safari/iPhone: fallback nativo de vídeo.
