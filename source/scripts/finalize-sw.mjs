import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(dist, 'manifest.webmanifest'), 'utf8'));
const refs = new Set(['./', './index.html', './manifest.webmanifest']);

for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const ref = match[1];
  if (/^(?:https?:|data:|blob:|#)/i.test(ref)) continue;
  refs.add(ref.startsWith('./') ? ref : `./${ref.replace(/^\//, '')}`);
}
for (const icon of manifest.icons || []) refs.add(icon.src);
for (const shortcut of manifest.shortcuts || []) {
  for (const icon of shortcut.icons || []) refs.add(icon.src);
}

async function addDirectory(directory) {
  const absolute = resolve(dist, directory);
  let entries = [];
  try { entries = await readdir(absolute, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = resolve(absolute, entry.name);
    if (entry.isDirectory()) await addDirectory(relative(dist, full));
    else refs.add(`./${relative(dist, full).split(sep).join('/')}`);
  }
}

// Los bundles de la interfaz y workers deben estar disponibles sin conexión.
await addDirectory('assets');
await addDirectory('icons');
// FFmpeg Core (32 MB) se almacena bajo demanda desde Ajustes para no bloquear la instalación PWA.

// Edición Web Light: el worker conserva su fallback CDN y MediaForge proporciona URLs explícitas al cargar FFmpeg.

const swPath = resolve(dist, 'sw.js');
let sw = await readFile(swPath, 'utf8');
const line = `const SHELL=${JSON.stringify([...refs].sort())}; // __PRECACHE__`;
sw = sw.replace(/^const SHELL=.*?; \/\/ __PRECACHE__$/m, line);
if (!sw.includes('// __PRECACHE__')) throw new Error('No se encontró el marcador de precache en dist/sw.js');
await writeFile(swPath, sw);
console.log(`Service worker finalizado con ${refs.size} recursos de interfaz`);
