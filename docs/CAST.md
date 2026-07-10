# MediaForge Cast

## Modos disponibles

### Google Cast

Usa el Web Sender SDK y el receptor multimedia predeterminado. Admite URLs accesibles por el dispositivo receptor. La combinación más fiable es MP4/H.264/AAC.

### AirPlay

Se muestra cuando Safari expone `webkitShowPlaybackTargetPicker`. Puede enviar el archivo local abierto en MediaForge según las capacidades del sistema.

### Cast Bridge

Servidor local temporal para archivos del PC. Se ejecuta con Python, expone un único archivo y genera una URL aleatoria.

## Flujo recomendado para MKV/HEVC/DTS

1. Inspecciona el archivo.
2. Convierte o prepara una copia MP4 H.264/AAC.
3. Sirve la copia con Cast Bridge.
4. Pega la URL en MediaForge Cast.

## Limitaciones

- `blob:` y `file:` no son accesibles desde Chromecast.
- El Bridge no transcodifica en tiempo real.
- URLs con DRM, autenticación o bloqueo geográfico pueden fallar.
- El emisor y receptor deben estar en la misma red y sin aislamiento de clientes.
