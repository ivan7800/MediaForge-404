# Changelog

## 4.0.1 — Fullscreen Hotfix

- Corregido el modo pantalla completa para ocupar el viewport completo.
- Eliminados `aspect-ratio`, `max-height`, marcos, filtros y radios durante fullscreen.
- Añadido soporte prefijado de WebKit y fullscreen nativo de vídeo para Safari/iPhone.
- Sincronizado el estado accesible del botón (`aria-label`, `aria-pressed`).
- Añadida prueba Playwright específica de geometría fullscreen.

## 4.0.0 — 2026-07-10

### Producto

- Biblioteca inteligente con etiquetas, colecciones, búsqueda, filtros, ordenación, progreso y reanudación.
- Exportación de biblioteca a JSON y CSV.
- Inspector profesional con diagnóstico de compatibilidad, metadatos, SHA-256, análisis de contenedor/pistas y exportación JSON/TXT.
- Validación real de lectura mediante FFmpeg.
- Reparación no destructiva de contenedores mediante remultiplexado, marcas de tiempo e índice regenerados cuando es posible.
- 9 modos de pantalla: Studio, Televisión, CRT 404, VHS 404, Cine, OLED, Cyberpunk, Retro TV y Minimal.
- Se mantienen 24 skins U404, importación/exportación de temas y selección aleatoria.

### PWA y funcionamiento offline

- Service worker v4 con cachés separadas de interfaz y runtime.
- Navegación `network-first`, recursos estáticos `stale-while-revalidate` y FFmpeg `cache-first`.
- Detección de nuevas versiones y activación controlada con `SKIP_WAITING`.
- Botón para descargar y guardar el motor FFmpeg para uso offline.
- Limpieza automática de cachés antiguas.

### Arquitectura y seguridad

- Restaurado el núcleo FFmpeg local que faltaba en la edición Web Light.
- Eliminadas todas las excepciones de CDN y referencias a unpkg en producción.
- `@ffmpeg/core` 0.12.10 incluido como recurso local ESM.
- Vite actualizado a 7.3.6.
- Auditoría npm: 0 vulnerabilidades conocidas.
- Pipeline reproducible que copia el núcleo local antes de cada build.
- Fallback del inspector: intenta `ffprobe` JSON y continúa con el analizador FFmpeg si el entorno no lo admite.

### QA

- Suite Playwright para escritorio y viewport Pixel 7.
- Pruebas de navegación, skins, modos, biblioteca, SHA-256, conversión MP3, análisis, validación, reparación, recursos PWA y overflow móvil.
- Resultado final: 13 pruebas superadas y 3 omisiones deliberadas para no duplicar operaciones WASM pesadas.

### Documentación

- Guía de despliegue corregida para GitHub Desktop/Git debido al WASM de 32 MB.
- Informe de auditoría, informe de pruebas y lista de archivos actualizados.
- Hoja de ruta separada para IA local real, sin controles ficticios.

## 3.0.0 — 2026-07-10

- Theme Engine U404 con 24 skins.
- Importación y exportación de temas JSON.
- Tema aleatorio.
- 6 modos de pantalla originales.
- Edición Web Light sin núcleo FFmpeg local completo.
