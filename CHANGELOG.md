# Changelog

## 4.1.0 — Cast Edition

### Transmisión

- Integrado Google Cast Web Sender SDK bajo demanda.
- Compatible con Chromecast, Google TV y receptores Cast.
- Envío de MP4, WebM, HLS, DASH, MP3, M4A/AAC y Ogg mediante URL.
- Selector AirPlay para Safari cuando está disponible.
- Panel remoto con estado, tiempo, pausa, búsqueda, volumen, desconexión y detención.
- Indicador visual de disponibilidad y conexión.

### Cast Bridge

- Añadido servidor local Python sin dependencias externas.
- Sirve exclusivamente el archivo elegido mediante una ruta aleatoria.
- Soporta `Range`, avance, retroceso, CORS y archivos grandes.
- Lanzador Windows por arrastrar y soltar.
- Guía de privacidad y uso en redes privadas.

### Correcciones y QA

- Restauradas las funciones ausentes `handleShortcuts` y `bindDragDrop`, que provocaban un error de arranque silencioso.
- Actualizada CSP para el SDK oficial de Google Cast y medios remotos.
- Service worker v4.1 y cachés versionadas.
- Añadido smoke test reproducible de inicio, navegación, Cast simulado y móvil.
- Eliminada la dependencia de `@ffmpeg/core` del paquete fuente ligero.

## 4.0.2 — Web Light

- Eliminadas las copias locales de `ffmpeg-core.wasm` para respetar el límite del cargador web de GitHub.

## 4.0.1 — Fullscreen Hotfix

- Fullscreen real, WebKit/Safari y estado accesible del botón.
