# MediaForge Cast Bridge

Sirve un único archivo local mediante HTTP dentro de la red doméstica para que Google Cast pueda acceder a él.

## Windows

1. Instala Python 3.
2. Arrastra el vídeo o audio sobre `START_CAST_BRIDGE.bat`.
3. Permite el acceso del Firewall solo en redes privadas.
4. Pega en MediaForge la URL copiada al portapapeles.
5. Mantén la consola abierta y pulsa `Ctrl+C` para detenerla.

El Bridge utiliza una ruta aleatoria, admite peticiones Range y nunca modifica el archivo. Úsalo únicamente en redes privadas.
