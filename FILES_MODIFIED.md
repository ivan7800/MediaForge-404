# Archivos modificados — MediaForge 404 v4.1.0

- `source/src/main.js`: Google Cast, AirPlay, controlador remoto, modal de transmisión, corrección de atajos y drag & drop.
- `source/src/styles.css`: botón Cast, estados, panel remoto y diseño móvil.
- `source/index.html`: CSP actualizada para SDK Cast y medios HTTP/HTTPS.
- `source/public/cast-bridge/*`: Bridge local Python, lanzador y documentación.
- `source/public/sw.js`: caché v4.1 y recursos ligeros.
- `source/public/manifest.webmanifest`: descripción Cast.
- `source/scripts/smoke-inline.mjs`: prueba de navegador sin localhost.
- `source/scripts/prepare-vendor.mjs`: build Web Light sin copiar WASM de 32 MB.
- `source/tests/mediaforge.spec.js`: casos Cast y recursos Bridge.
- `source/playwright.config.js`: base URL configurable.
- `source/package.json` y `package-lock.json`: versión 4.1.0 y scripts.
- `index.html`, `assets/*`, `sw.js`, `manifest.webmanifest`: build final recompilado.
- `README.md`, `CHANGELOG.md`, `SECURITY.md`, `TEST_REPORT.md`, `AUDIT_REPORT.md`, `docs/CAST.md`: documentación final.
