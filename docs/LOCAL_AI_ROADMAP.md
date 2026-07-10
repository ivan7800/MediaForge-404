# Hoja de ruta de IA local

## Decisión de la versión 4.0.0

MediaForge 404 no muestra botones de “IA” que no ejecuten un modelo real. OCR, transcripción y subtítulos automáticos son viables en navegador, pero incorporarlos de forma profesional requiere descargar modelos grandes, gestionar memoria, informar del coste y probar hardware muy distinto.

## Arquitectura propuesta

La integración debe ser modular y opcional:

1. **Gestor de modelos**: descarga explícita, tamaño visible, progreso, versión, licencia, SHA-256 y eliminación independiente.
2. **Web Worker dedicado**: evita bloquear la interfaz.
3. **IndexedDB o Cache Storage**: conserva modelos solo después del consentimiento del usuario.
4. **Detección de capacidad**: memoria, WebAssembly, WebGPU cuando exista y modo reducido para equipos modestos.
5. **Cola de trabajos**: impide competir con FFmpeg y permite cancelar.
6. **Privacidad verificable**: ningún audio, vídeo o fotograma sale del dispositivo.

## Módulos recomendados

### Transcripción y subtítulos

- Motor Whisper local o equivalente WebAssembly/WebGPU.
- Selección de modelo pequeño, medio y de mayor precisión.
- Salida SRT, VTT, TXT y JSON con marcas de tiempo.
- Traducción opcional separada de la transcripción.

### OCR de fotogramas

- Extracción de fotogramas mediante FFmpeg.
- OCR local sobre selección, intervalo o escena.
- Exportación TXT/JSON y superposición revisable.

### Análisis

- Detección de silencios, escenas y posibles capítulos mediante reglas locales.
- Identificación de idioma con modelo ligero.
- Resumen solo después de disponer de una transcripción real.

## Requisitos antes de publicarlo

- Licencias compatibles y avisos de cada modelo.
- Pruebas en Windows, macOS, Android e iOS físico.
- Límites de tamaño y memoria por navegador.
- Descarga bajo demanda; nunca incluir cientos de MB en la carga inicial.
- Tests de cancelación, pérdida de conexión, almacenamiento insuficiente y actualización de modelos.

Este diseño permite añadir IA local sin degradar el arranque, la privacidad ni la estabilidad de MediaForge 404.
