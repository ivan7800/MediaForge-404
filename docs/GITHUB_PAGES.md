# Publicación exacta en GitHub Pages

## Por qué no conviene usar el cargador web

MediaForge 404 incluye `vendor/ffmpeg/ffmpeg-core.wasm`, de aproximadamente 32 MB. GitHub permite almacenarlo porque está por debajo de 100 MB, pero el formulario web `Add file → Upload files` suele limitar cada archivo a 25 MB. Por eso la publicación debe hacerse con GitHub Desktop o Git.

No elimines el WASM: conversión, análisis profundo, validación y reparación dependen de él.

## Opción recomendada: GitHub Desktop

1. Descomprime el paquete final.
2. Abre GitHub Desktop.
3. Selecciona `File → Add local repository`.
4. Elige la carpeta descomprimida. Si todavía no es un repositorio, usa `create a repository` desde esa carpeta.
5. Escribe el mensaje `MediaForge 404 v4.0.0` y pulsa `Commit to main`.
6. Pulsa `Publish repository`.
7. Abre el repositorio en GitHub.
8. Ve a `Settings → Pages`.
9. En `Build and deployment`, selecciona `Deploy from a branch`.
10. Elige `main` y `/(root)` y guarda.

## Opción por terminal

Abre una terminal dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "MediaForge 404 v4.0.0"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Después activa Pages desde `Settings → Pages → Deploy from a branch → main → /(root)`.

## Estructura que debe quedar en la raíz

```text
.nojekyll
index.html
manifest.webmanifest
sw.js
assets/
icons/
vendor/ffmpeg/ffmpeg-core.js
vendor/ffmpeg/ffmpeg-core.wasm
README.md
source/
docs/
```

No subas el ZIP como único archivo ni una carpeta exterior que contenga otra carpeta con el proyecto.

## Comprobación tras publicar

1. Abre la URL de Pages y acepta el aviso local.
2. Comprueba Reproductor, Biblioteca, Audio Lab, Convertidor, Inspector y Ajustes.
3. Cambia una skin y un modo; recarga y confirma que se conservan.
4. Carga un MP4 o WAV pequeño.
5. En Inspector, calcula SHA-256 y ejecuta análisis profundo.
6. Realiza una conversión corta.
7. Usa `Preparar motor offline` y después prueba una recarga sin conexión.
8. Tras una nueva versión, pulsa `Buscar actualización` o recarga hasta que aparezca el aviso de actualización.

## Errores habituales

- **Página 404 o vacía:** el contenido se subió dentro de una subcarpeta en vez de la raíz del repositorio.
- **FFmpeg no carga:** faltan `vendor/ffmpeg/ffmpeg-core.js` o `ffmpeg-core.wasm`, o el push quedó incompleto.
- **GitHub rechaza el WASM:** se está usando el cargador web. Cambia a GitHub Desktop o Git.
- **Aparece una versión antigua:** pulsa el botón de actualización, cierra las pestañas antiguas o borra los datos del sitio para retirar un service worker anterior.
- **La instalación PWA no aparece:** el navegador o el contexto no cumplen todos los criterios; la aplicación web continúa funcionando.
- **La conversión se queda sin memoria:** usa un archivo más pequeño, reduce resolución o utiliza FFmpeg nativo en escritorio.

## Actualizar una versión ya publicada

Sustituye los archivos de producción por los del nuevo paquete y ejecuta:

```bash
git add .
git commit -m "Actualizar MediaForge 404"
git push
```

El service worker v4 elimina cachés antiguas y muestra una actualización cuando existe una versión nueva esperando activación.
