# Código fuente de MediaForge 404

## Requisitos

- Node.js 20 o superior.
- npm.
- Chromium instalado por Playwright para ejecutar las pruebas.

## Instalación

```bash
npm ci
npx playwright install chromium
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

El proceso `prebuild` ejecuta `scripts/prepare-vendor.mjs`, copia el núcleo ESM desde `@ffmpeg/core` a `public/vendor/ffmpeg`, construye `dist/` con Vite y finaliza el service worker con los nombres versionados reales.

## Pruebas

```bash
npm test
```

Para usar un Chromium del sistema en un entorno CI:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/ruta/a/chromium npm test
```

Los informes de Playwright se generan en `playwright-report/` y no se incluyen en el paquete final.
