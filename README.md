# MediaForge 404 v4.0.0

**Suite multimedia privada y local** para reproducir, organizar, inspeccionar, validar, reparar y convertir audio y vídeo desde el navegador. Incluye U404 Universal Media Engine, biblioteca inteligente, Audio Lab, FFmpeg WebAssembly local, 24 skins y 9 modos de pantalla.

> Los archivos permanecen en el dispositivo. MediaForge 404 no utiliza cuentas, analítica, telemetría ni servidores de procesamiento.

## Funciones principales

- Reproductor local de audio y vídeo con playlist, subtítulos SRT/VTT, velocidad, PiP, pantalla completa, modo cine, captura, repetición A–B y reanudación.
- Biblioteca inteligente en IndexedDB con historial, favoritos, progreso, etiquetas, colecciones, búsqueda, filtros, ordenación y exportación JSON/CSV.
- Audio Lab con ecualizador de seis bandas, ganancia, balance, compresor, presets y visualizador.
- Conversión local a MP4, WebM, MP3, WAV y GIF, además de compresión, extracción de audio y remultiplexado.
- Inspector profesional con metadatos, compatibilidad estimada, SHA-256, análisis de contenedor y pistas, validación FFmpeg y exportación JSON/TXT.
- Reparación no destructiva de contenedores mediante remultiplexado, regeneración de marcas de tiempo e índice. Siempre genera una copia nueva.
- U404 Universal Media Engine: reproducción nativa → remultiplexado → transcodificación local → verificación de la copia.
- 24 skins U404 y 9 modos de pantalla: Studio, Televisión, CRT 404, VHS 404, Cine, OLED, Cyberpunk, Retro TV y Minimal.
- PWA instalable con actualización controlada, shell offline, caché bajo demanda del motor FFmpeg y botón para preparar el motor offline.
- CSP restrictiva y recursos de producción alojados dentro del proyecto, sin CDN.

## Arranque rápido en Windows

1. Descomprime el ZIP.
2. Ejecuta `START_MEDIAFORGE.bat`.
3. El lanzador buscará un puerto libre entre 8080 y 8090 y abrirá la aplicación en el navegador.

También puedes iniciar un servidor manualmente desde la carpeta raíz:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

No abras `index.html` con doble clic para usar FFmpeg o la PWA. WebAssembly, módulos y service workers requieren HTTP local o HTTPS.

## Publicación en GitHub Pages

El archivo `vendor/ffmpeg/ffmpeg-core.wasm` ocupa aproximadamente 32 MB. GitHub lo admite mediante Git porque está por debajo del límite general de 100 MB por archivo, pero el cargador web del navegador suele rechazar archivos mayores de 25 MB.

Usa **GitHub Desktop o Git desde terminal**, no `Add file → Upload files`.

```bash
git init
git add .
git commit -m "MediaForge 404 v4.0.0"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Después, en el repositorio:

1. Abre `Settings → Pages`.
2. En `Build and deployment`, selecciona `Deploy from a branch`.
3. Elige `main` y `/(root)`.
4. Guarda.

Consulta `docs/GITHUB_PAGES.md` para la guía completa y la lista de comprobación.

## Desarrollo y pruebas

Requisitos: Node.js 20 o superior.

```bash
cd source
npm ci
npx playwright install chromium
npm run dev
```

Build de producción:

```bash
npm run build
```

Pruebas automatizadas:

```bash
npm test
```

El pipeline copia el núcleo ESM de `@ffmpeg/core` a `public/vendor/ffmpeg`, construye la aplicación con Vite y genera el precache del service worker con los nombres versionados reales.

## Privacidad y almacenamiento

- Los archivos no se suben a ninguna nube.
- `localStorage` conserva ajustes visuales y preferencias.
- IndexedDB conserva historial, progreso, favoritos, etiquetas, colecciones y, cuando el navegador lo permite, referencias autorizadas a archivos.
- SHA-256 se calcula con Web Crypto dentro del navegador.
- Los temporales de FFmpeg se eliminan después de cada operación.
- El original nunca se sobrescribe durante conversión o reparación.
- La sección de privacidad permite borrar los datos locales.

## Límites honestos

MediaForge 404 no es un “códec mágico” y no puede garantizar todas las combinaciones de contenedor, códec, perfil y hardware. Tampoco puede eludir DRM. FFmpeg WebAssembly consume más memoria y es más lento que FFmpeg nativo; los archivos grandes, 4K o de larga duración pueden superar los límites del navegador.

La versión 4.0.0 no incorpora modelos de IA dentro del paquete. OCR, transcripción y generación de subtítulos local requieren modelos grandes, una estrategia modular y pruebas de hardware. Se documenta una integración profesional en `docs/LOCAL_AI_ROADMAP.md` en lugar de ofrecer botones simulados.

## Documentación

- `AUDIT_REPORT.md`: auditoría final multidisciplinar y puntuaciones.
- `TEST_REPORT.md`: build, seguridad y pruebas Playwright realizadas.
- `FILES_MODIFIED.md`: lista de archivos cambiados y propósito.
- `CHANGELOG.md`: novedades de la versión.
- `docs/GITHUB_PAGES.md`: despliegue exacto.
- `docs/UNIVERSAL_MEDIA_ENGINE.md`: arquitectura de compatibilidad y reparación.
- `docs/LOCAL_AI_ROADMAP.md`: hoja de ruta para OCR, transcripción y subtítulos locales.
- `SECURITY.md`: modelo de seguridad y privacidad.
- `THIRD_PARTY_NOTICES.md`: dependencias y licencias.

## Licencias

El código propio se distribuye bajo MIT. `@ffmpeg/core` 0.12.10 declara GPL-2.0-or-later. Antes de redistribuir, modificar o monetizar el paquete, revisa `THIRD_PARTY_NOTICES.md`, `licenses/GPL-2.0-or-later.txt` y `licenses/SOURCE_OFFER.md`.
