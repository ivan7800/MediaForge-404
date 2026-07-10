# U404 Universal Media Engine

## Qué es

No es un “códec universal” literal. Es una capa de compatibilidad que elige la ruta menos costosa y más segura para cada archivo:

1. **Detección:** MIME, extensión y `HTMLMediaElement.canPlayType()`.
2. **Reproducción nativa:** usa el decodificador del navegador cuando existe.
3. **Prueba real:** el elemento multimedia confirma o rechaza el contenido.
4. **Remultiplexado:** cambia el contenedor sin recodificar pistas compatibles.
5. **Transcodificación local:** crea MP4 H.264/AAC o MP3 cuando es necesario.
6. **Verificación:** prueba la copia generada antes de activarla.
7. **Conservación:** mantiene el original intacto y permite descargar la copia.

## Inspector profesional

El Inspector combina varias capas:

- Metadatos inmediatos del archivo y del elemento multimedia.
- Estimación de compatibilidad del navegador.
- Huella SHA-256 mediante Web Crypto.
- `ffprobe` JSON cuando el build lo admite.
- Fallback de análisis mediante salida estructurada de FFmpeg.
- Pistas de vídeo, audio, subtítulos y datos.
- Contenedor, duración, bitrate, códec, resolución, FPS, canales y frecuencia cuando están disponibles.
- Exportación JSON y TXT.

## Validación

La validación ejecuta una lectura completa de las pistas con nivel de error cuidadoso y salida nula. No certifica que el archivo sea perfecto, pero detecta errores declarados por FFmpeg durante la decodificación/lectura.

## Reparación

La reparación es no destructiva:

- Genera nuevas marcas de tiempo cuando es posible.
- Descarta paquetes corruptos que FFmpeg puede identificar.
- Reconstruye el índice y el contenedor mediante remultiplexado.
- Usa MP4 para fuentes compatibles, MKV para vídeo general y MKA para audio.
- Nunca sobrescribe el original.

No puede reconstruir fotogramas, muestras de audio o datos físicamente perdidos.

## Formatos de entrada previstos

MP4, M4V, MOV, WebM, MKV, AVI, WMV, MPEG-TS/MTS/M2TS, OGV, 3GP, MP3, WAV, OGG, M4A, FLAC, OPUS, AAC y WMA, siempre que el núcleo FFmpeg incluido pueda interpretar las pistas.

La extensión no garantiza que todas sus variantes o códecs internos funcionen.

## Salidas principales

- MP4 H.264 + AAC.
- MP4 por remultiplexado.
- MKV/MKA para reparación compatible.
- WebM VP9 + Opus.
- MP3.
- WAV PCM.
- GIF.

## Decisiones de seguridad

- Nombres de archivo saneados antes de escribir en el sistema virtual.
- Argumentos procedentes de presets internos.
- Interfaz y Bridge en el mismo origen; FFmpeg y Google Cast se cargan bajo demanda desde proveedores externos declarados.
- Operaciones pesadas serializadas.
- Temporales eliminados en `finally`.
- Original intacto.
- Límites y avisos para archivos grandes.

## Límites

- DRM y discos protegidos: no admitidos.
- Archivos cercanos a 1,9 GB: bloqueados por seguridad.
- 4K o medios largos: pueden agotar memoria.
- Safari/iOS: suele tener menos memoria disponible.
- URLs remotas: pueden quedar bloqueadas por CORS.
- DVD/Blu-ray, menús, HLS/DASH y subtítulos ASS completos: fuera del alcance de esta versión.

## Próximo nivel

Para acercarse al rendimiento y cobertura de VLC se necesita un compañero de escritorio con FFmpeg nativo, procesamiento por streaming, builds de códecs específicos y una matriz de cientos de muestras multimedia.
