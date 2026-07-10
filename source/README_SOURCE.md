# Código fuente — MediaForge 404 v4.1.0

## Requisitos

- Node.js 20+
- npm
- Python 3 solo para Cast Bridge

## Desarrollo

```bash
npm ci
npm run dev
```

## Build Web Light

```bash
npm run build
```

El build no copia `ffmpeg-core.wasm`. FFmpeg Core se carga bajo demanda desde unpkg para que ningún archivo supere el límite de 25 MB del cargador web de GitHub.

Google Cast se carga bajo demanda desde el SDK oficial de Google. El código de producción usa el receptor multimedia predeterminado.

## Pruebas

```bash
npx playwright install chromium
npm test
```

Prueba aislada sin servidor local:

```bash
npm run test:smoke
```

El smoke test valida inicio, navegación, Cast simulado y viewport móvil mediante la build compilada.
