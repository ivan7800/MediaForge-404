# Seguridad y privacidad

## Modelo

MediaForge 404 es una aplicación estática. No incluye backend, cuentas, base de datos remota, anuncios, analítica ni telemetría.

## Medidas aplicadas

- Content Security Policy limitada al mismo origen, `blob:` y WebAssembly.
- Sin scripts, fuentes, modelos o APIs remotas en producción.
- `object-src 'none'`, `base-uri 'self'` y `form-action 'none'`.
- Nombres, etiquetas, colecciones y metadatos escapados antes de insertarlos en HTML.
- Presets cerrados para FFmpeg; no existe consola de comandos arbitrarios.
- Procesamiento en memoria y sistema virtual de FFmpeg.
- Exclusión mutua de operaciones pesadas.
- Limpieza de temporales y revocación de object URLs.
- Manejo defensivo de IndexedDB, `localStorage`, Cache Storage y service worker.
- Service worker limitado a solicitudes GET del mismo origen y excluye peticiones `Range`.
- SHA-256 calculado localmente con Web Crypto y límite preventivo de tamaño.
- Actualización PWA controlada por mensaje `SKIP_WAITING`.
- Auditoría npm final sin vulnerabilidades conocidas.

## Datos locales

`localStorage` conserva preferencias visuales. IndexedDB conserva nombre, tamaño, tipo, favorito, progreso, etiquetas, colección, huella calculada y, cuando el navegador lo permite, referencias autorizadas a archivos. Cache Storage puede conservar la interfaz y el núcleo FFmpeg cuando el usuario prepara el modo offline.

El contenido multimedia no se copia a una nube.

## Riesgos residuales

- Un archivo multimedia manipulado podría explotar un fallo del navegador o de FFmpeg; mantén ambos actualizados.
- Los archivos grandes pueden provocar presión de memoria o cierre de la pestaña.
- Un service worker antiguo puede requerir recarga o limpieza de datos del sitio.
- El núcleo GPL y los códecs enlazados requieren revisión de licencias antes de distribución comercial.
- GitHub Pages no añade cabeceras COOP/COEP personalizadas, por lo que esta edición utiliza el núcleo monohilo compatible.

## Reporte

Al publicar el repositorio, activa GitHub Security Advisories o facilita un canal privado. No publiques archivos multimedia sensibles en incidencias públicas.
