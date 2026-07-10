# Universo 404 — Style Kit

Este kit convierte el estilo de **Santuario 404** en un mini design system reutilizable para otras páginas de GitHub Pages.

## Qué contiene

- `assets/u404/u404-style-system.css`  
  Tokens de color, 10 skins, glassmorphism, botones, paneles, tarjetas, hero, topbar, óculo animado, chips, grids, microanimaciones y responsive.

- `assets/u404/u404-style-system.js`  
  Gestión de skins, persistencia en `localStorage`, cambio de color del `theme-color`, alto contraste, reducción de movimiento y generador de selector de skins.

- `example.html`  
  Página demo lista para abrir y copiar estructura.

- `claude-prompt-aplicar-estilo.md`  
  Prompt para pegar en Claude/Gemini/Cursor cuando quieras adaptar otra app al estilo Universo 404.

## Instalación rápida en otra app

Copia la carpeta:

```text
assets/u404/
```

a la raíz de tu otra web/app.

En el `<head>` añade:

```html
<meta name="theme-color" content="#0F141F">
<link rel="stylesheet" href="assets/u404/u404-style-system.css">
<script defer src="assets/u404/u404-style-system.js"></script>
```

Opcionalmente, para usar las mismas fuentes de Santuario 404:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap">
```

En el HTML principal:

```html
<html lang="es" data-u404-skin="santuario">
<body class="u404-theme">
  <div class="u404 u404-app">
    <!-- tu contenido -->
  </div>
</body>
```

## Clases recomendadas

```html
<header class="u404-topbar">
  <a class="u404-brand" href="#">
    <span class="u404-brand-mark"></span>
    <span><b>Nombre App</b><small>Universo 404</small></span>
  </a>
  <nav class="u404-nav">
    <a aria-current="page" href="#">Inicio</a>
    <a href="#">Herramientas</a>
  </nav>
  <button class="u404-iconbtn" data-u404-cycle-skin>◐</button>
</header>

<section class="u404-hero">
  <div>
    <span class="u404-eyebrow">Tu claim</span>
    <h1>Título <em>premium</em></h1>
    <p class="u404-lead">Texto editorial breve.</p>
    <a class="u404-btn is-primary" href="#">Acción principal</a>
  </div>
  <div class="u404-oculus is-live"><div class="u404-oculus-core"></div></div>
</section>

<div class="u404-grid">
  <article class="u404-card">
    <p class="u404-card-kicker">Categoría</p>
    <h3 class="u404-card-title">Tarjeta</h3>
    <p class="u404-muted">Descripción.</p>
  </article>
</div>
```

## Selector de skins

Pon un contenedor donde quieras:

```html
<div id="skinPicker" class="u404-skin-grid"></div>
```

Y después:

```html
<script>
window.addEventListener('DOMContentLoaded', () => {
  U404Style.injectSkinPicker('#skinPicker');
});
</script>
```

También puedes crear botones sueltos:

```html
<button data-u404-set-skin="oro">Oro</button>
<button data-u404-set-skin="obsidiana">Obsidiana</button>
<button data-u404-cycle-skin>Rotar skin</button>
```

## Reglas para que todas tus apps parezcan de la misma familia

1. No copies todo el `index.html` de Santuario 404. Copia solo el sistema visual.
2. Usa siempre `u404-theme` en el body y `u404` en el contenedor principal.
3. Cambia botones/paneles/tarjetas antiguos a `u404-btn`, `u404-panel`, `u404-card`.
4. Mantén una sola topbar visual: `u404-topbar` + `u404-brand`.
5. Usa el óculo `u404-oculus` como firma visual solo en home/hero o en pantallas premium, no en cada sección.
6. No metas 20 animaciones distintas. El estilo funciona por sobriedad: fade, respiración, glow y hover suave.
7. Antes de subir a GitHub Pages, prueba en móvil real, modo incógnito y un navegador empresarial si puedes.

## Skins incluidas

`santuario`, `bosque`, `oceano`, `luna`, `aurora`, `niebla`, `piedra`, `ambar`, `obsidiana`, `oro`.

## Nota importante

El sistema está prefijado con `u404-` para no romper tus otras webs. Si una página ya tiene clases `.btn`, `.panel` o `.card`, solo se aplicarán dentro de un contenedor `.u404`.
