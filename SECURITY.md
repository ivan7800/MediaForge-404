# Seguridad y privacidad

## Modelo

MediaForge 404 es una aplicación estática sin cuentas, anuncios, analítica ni backend propio. Los archivos multimedia permanecen en el dispositivo salvo cuando el usuario decide servir uno temporalmente mediante Cast Bridge dentro de su red local.

## Medidas aplicadas

- CSP restringida al mismo origen, FFmpeg bajo demanda y SDK oficial de Google Cast.
- Entradas de nombres, etiquetas, títulos y URLs validadas o escapadas.
- Solo se aceptan URLs HTTP/HTTPS para Cast.
- Sin consola FFmpeg arbitraria: las operaciones usan presets cerrados.
- IndexedDB y `localStorage` con manejo defensivo de errores.
- Service worker limitado a solicitudes GET del mismo origen y excluye peticiones Range.
- Temporales FFmpeg eliminados tras cada operación.
- Object URLs revocadas cuando dejan de utilizarse.
- `npm audit`: 0 vulnerabilidades conocidas en la build final.

## Google Cast

MediaForge carga el Web Sender SDK oficial desde `www.gstatic.com`. La app entrega al receptor la URL elegida por el usuario y metadatos básicos. MediaForge no descarga, proxyfica ni almacena ese contenido en un servidor propio.

## Cast Bridge

- Expone únicamente el archivo seleccionado.
- Genera una ruta aleatoria en cada ejecución.
- Incluye soporte HTTP Range para búsqueda y reanudación.
- No publica directorios ni permite seleccionar rutas desde la red.
- Se detiene al cerrar la consola o pulsar `Ctrl+C`.
- Debe utilizarse solo en redes privadas.

Riesgo residual: cualquier dispositivo de la misma red que obtenga la URL completa podría acceder al archivo mientras el Bridge esté activo. No abras el puerto en el router ni lo uses en Wi-Fi público.

## Dependencias externas

- Google Cast Web Sender SDK: cargado bajo demanda desde Google.
- FFmpeg Core WebAssembly: descargado bajo demanda desde unpkg en la edición Web Light.

Los archivos multimedia se procesan localmente después de cargar FFmpeg.
