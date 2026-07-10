import { copyFile, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = resolve(root, 'node_modules/@ffmpeg/core/dist/esm');
const target = resolve(root, 'public/vendor/ffmpeg');
await mkdir(target, { recursive: true });
for (const file of ['ffmpeg-core.js', 'ffmpeg-core.wasm']) {
  const input = resolve(source, file);
  await access(input);
  await copyFile(input, resolve(target, file));
}
console.log('FFmpeg Core copiado a public/vendor/ffmpeg');
