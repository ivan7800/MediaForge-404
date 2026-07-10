# Informe de pruebas — MediaForge 404 v4.1.0

## Superadas

- `npm ci`: correcto.
- `npm audit`: 0 vulnerabilidades conocidas.
- `npm run build`: correcto.
- `node --check source/src/main.js`: correcto.
- Compilación Python de Cast Bridge: correcta.
- Test real de Bridge: respuesta `206 Partial Content`, `Accept-Ranges: bytes` y longitud exacta solicitada.
- Smoke test Chromium aislado: inicio sin errores JavaScript.
- Navegación por las seis áreas principales: correcta.
- Sesión Google Cast simulada: selección, carga de URL y panel remoto correctos.
- Modal Cast y guía Bridge: correctos.
- Viewport móvil 390 × 844: sin overflow horizontal.
- Recursos PWA y Cast Bridge presentes.
- Ningún archivo del paquete supera 25 MB.

## Suite Playwright convencional

El navegador Chromium del entorno bloquea cualquier navegación a localhost o IP privada con `ERR_BLOCKED_BY_ADMINISTRATOR`. Por ello la suite E2E tradicional no puede navegar al servidor de Vite en este contenedor.

Para evitar afirmar un resultado falso, se añadió `npm run test:smoke`, que inyecta la build compilada en Chromium sin usar localhost y valida inicio, navegación, Cast simulado y móvil. Esta prueba sí finaliza correctamente.

## Pendiente en hardware real

- Descubrimiento de Chromecast/Google TV en una red doméstica.
- Reproducción de MP4, HLS y URL servida por Cast Bridge.
- AirPlay físico en Safari/iPhone/macOS.
- Diferentes modelos de TV y redes con aislamiento de clientes.
