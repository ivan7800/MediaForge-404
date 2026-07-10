# Prompt para aplicar el estilo Universo 404 a otra app

Actúa como CTO, diseñador UX/UI senior y frontend engineer.

Quiero adaptar esta app al estilo visual **Universo 404 / Santuario 404**, sin romper su funcionalidad existente.

## Objetivo

Aplicar un sistema visual común a la app para que parezca parte del mismo ecosistema que mis otras páginas 404: oscuro, premium, elegante, con glassmorphism sobrio, tipografía editorial, glow controlado, skins reutilizables y animaciones suaves.

## Archivos disponibles

He añadido estos archivos al proyecto:

- `assets/u404/u404-style-system.css`
- `assets/u404/u404-style-system.js`

## Tareas obligatorias

1. Conectar el CSS y JS en el `<head>` o antes del cierre de `body`, según corresponda.
2. Añadir en `<html>` el atributo `data-u404-skin="santuario"` si no existe.
3. Añadir `class="u404-theme"` al `<body>`.
4. Envolver el contenido principal con `<div class="u404 u404-app">` o adaptar el contenedor raíz existente para que use esas clases.
5. Convertir la cabecera actual en una `u404-topbar`, conservando navegación y botones existentes.
6. Adaptar botones principales a `u404-btn is-primary` y botones secundarios a `u404-btn`.
7. Adaptar paneles, tarjetas o módulos a `u404-panel` o `u404-card`.
8. Adaptar chips/filtros/presets a `u404-chip`.
9. Añadir un botón visible para cambiar skin con `data-u404-cycle-skin`, o un selector de skins con `U404Style.injectSkinPicker('#skinPicker')`.
10. Mantener toda la lógica JavaScript existente. No elimines funciones salvo que estén duplicadas o rotas.
11. No cambies textos importantes ni enlaces reales.
12. No añadas librerías externas salvo las fuentes opcionales de Google Fonts si el proyecto ya acepta recursos externos.
13. Mantener compatibilidad GitHub Pages: todo estático, sin build obligatorio, sin Node obligatorio.
14. Revisar responsive móvil: topbar, cards, botones, grids y modales deben verse bien en 360px de ancho.
15. Respetar accesibilidad: foco visible, contraste correcto, botones con texto o aria-label.

## Estilo deseado

- Fondo oscuro con gradientes radiales sutiles.
- Paneles translúcidos con borde fino.
- Botones redondeados tipo píldora.
- Hover con elevación leve, no exagerada.
- Títulos editoriales con aire premium.
- Acentos oro/cian/verde según skin.
- Animaciones suaves: fade-in, respiración, pulse y hover.
- Nada hortera, nada saturado, nada tipo plantilla genérica IA.

## Entrega

Devuélveme:

1. Proyecto corregido completo.
2. Lista de archivos tocados.
3. Bugs detectados.
4. Verificación móvil/desktop.
5. Riesgos pendientes.
6. Puntuación final por categorías y global.

Antes de terminar, comprueba que no hay rutas rotas, que el selector de skin funciona, que localStorage no bloquea la app, que no hay errores de consola y que GitHub Pages puede servir la app correctamente.
