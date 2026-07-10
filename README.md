# MediaForge 404 v4.1.0 Cast Edition

**Reproductor multimedia privado y local** con biblioteca, Audio Lab, conversión, inspector técnico, skins U404, modos de televisión y transmisión a pantallas.

> Tus archivos permanecen en tu dispositivo. Reproduce, inspecciona, convierte y transmite contenido multimedia directamente desde el navegador.

## Novedades Cast

- Google Cast Web Sender para Chromecast, Google TV y televisores compatibles.
- Envío de MP4, WebM, HLS, DASH y audio mediante URL HTTP/HTTPS.
- Selector AirPlay en Safari cuando el sistema lo admite.
- Panel remoto con dispositivo, título, estado, tiempo, búsqueda, volumen, pausa, desconexión y detención.
- MediaForge Cast Bridge para archivos locales del PC.
- Bridge de un solo archivo, con ruta aleatoria, CORS y peticiones HTTP Range.
- Sin subida a la nube ni servidor externo de MediaForge.

## Funciones principales

- Vídeo y audio local, playlist, subtítulos SRT/VTT, velocidad, PiP, fullscreen real, captura y repetición A–B.
- Biblioteca IndexedDB con historial, favoritos, progreso, etiquetas, colecciones y exportación.
- Audio Lab con ecualizador, presets, ganancia, balance, compresor y visualizador.
- Conversión bajo demanda a MP4, WebM, MP3, WAV y GIF mediante FFmpeg WebAssembly.
- Inspector, SHA-256, validación y reparación no destructiva.
- U404 Universal Media Engine: reproducción nativa, remultiplexado y transcodificación de compatibilidad.
- 24 skins y 9 modos de pantalla U404.
- PWA compatible con GitHub Pages.

## Transmitir una URL o stream

1. Abre MediaForge desde GitHub Pages en Chrome o Edge.
2. Pulsa el icono **Transmitir** del reproductor.
3. Pega una URL accesible por el Chromecast.
4. Selecciona formato o deja la detección automática.
5. Elige el Chromecast o Google TV.

La aplicación utiliza el receptor multimedia predeterminado de Google. No es necesario registrar un receptor personalizado.

## Transmitir un archivo local del PC

Chromecast no puede abrir directamente una URL temporal `blob:` creada por el navegador. Usa el Bridge incluido:

1. Abre la carpeta `cast-bridge`.
2. Arrastra el vídeo sobre `START_CAST_BRIDGE.bat`.
3. Permite el Firewall solamente en redes privadas.
4. Pega en MediaForge la URL copiada al portapapeles.
5. Mantén la consola abierta durante la reproducción.
6. Pulsa `Ctrl+C` al terminar.

El Bridge no recodifica. Para máxima compatibilidad usa MP4 con H.264 y AAC, o convierte antes el archivo desde MediaForge.

## Publicación en GitHub Pages

Esta es una edición **Web Light**. Ningún archivo supera los 25 MB, por lo que puede subirse desde la interfaz web de GitHub.

1. Sube el contenido de esta carpeta a la raíz del repositorio.
2. Abre `Settings → Pages`.
3. Selecciona `Deploy from a branch`.
4. Elige `main` y `/(root)`.

Google Cast requiere HTTPS —GitHub Pages ya lo proporciona— y conexión a Internet para descargar el SDK oficial. FFmpeg también se descarga solo cuando abres una función avanzada.

## Desarrollo y pruebas

```bash
cd source
npm ci
npm run build
npx playwright install chromium
npm test
```

Smoke test sin servidor local:

```bash
npm run test:smoke
```

## Límites honestos

- Google Cast no puede recibir directamente archivos locales `blob:`.
- El dispositivo receptor debe poder acceder a la URL y admitir el contenedor/códec.
- AirPlay depende de Safari y del sistema Apple.
- DLNA/Miracast no ofrecen una API web estándar equivalente.
- DRM, URLs con autenticación privada y servidores que bloqueen el acceso pueden fallar.
- FFmpeg WebAssembly es más lento y consume más memoria que FFmpeg nativo.

Consulta `docs/CAST.md`, `AUDIT_REPORT.md` y `TEST_REPORT.md` para más detalles.
