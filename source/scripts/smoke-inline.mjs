import { chromium } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const assets = await readdir(resolve(dist, 'assets'));
const jsName = assets.find(name => /^index-.*\.js$/.test(name));
const cssName = assets.find(name => /^index-.*\.css$/.test(name));
if (!jsName || !cssName) throw new Error('No se encontraron los bundles de producción.');
const [js, css] = await Promise.all([
  readFile(resolve(dist, 'assets', jsName), 'utf8'),
  readFile(resolve(dist, 'assets', cssName), 'utf8')
]);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  args: process.env.CI ? ['--no-sandbox', '--disable-gpu'] : []
});

async function boot(viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://www.gstatic.com/**', route => route.abort());
  await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css}</style></head><body class="u404-theme"><div id="app"></div></body></html>`);
  await page.addScriptTag({ content: js, type: 'module' });
  await page.waitForSelector('.app-shell');
  const legal = page.locator('#acceptLegalBtn');
  if (await legal.isVisible().catch(() => false)) await legal.click();
  return { page, errors };
}

const desktop = await boot({ width: 1440, height: 900 });
for (const view of ['library', 'audio', 'converter', 'inspector', 'settings', 'player']) {
  await desktop.page.locator(`[data-view="${view}"]`).click();
  const active = await desktop.page.locator(`[data-view-panel="${view}"]`).evaluate(element => element.classList.contains('active'));
  if (!active) throw new Error(`La vista ${view} no se activó.`);
}
await desktop.page.evaluate(() => {
  class Context {
    constructor() { this.session = null; this.state = 'NOT_CONNECTED'; }
    setOptions(options) { this.options = options; }
    addEventListener() {}
    getCastState() { return this.state; }
    getCurrentSession() { return this.session; }
    async requestSession() {
      this.session = {
        loaded: null,
        getCastDevice: () => ({ friendlyName: 'TV Salón' }),
        loadMedia: async request => { this.session.loaded = request; }
      };
      this.state = 'CONNECTED';
    }
    endCurrentSession() { this.session = null; this.state = 'NOT_CONNECTED'; }
  }
  const context = new Context();
  window.cast = { framework: {
    CastContext: { getInstance: () => context },
    CastContextEventType: { CAST_STATE_CHANGED: 'cast', SESSION_STATE_CHANGED: 'session' },
    CastState: { NO_DEVICES_AVAILABLE: 'NO_DEVICES_AVAILABLE', NOT_CONNECTED: 'NOT_CONNECTED', CONNECTED: 'CONNECTED' },
    RemotePlayerEventType: { IS_CONNECTED_CHANGED: 'ic', IS_PAUSED_CHANGED: 'ip', CURRENT_TIME_CHANGED: 'ct', DURATION_CHANGED: 'du', VOLUME_LEVEL_CHANGED: 'vl', PLAYER_STATE_CHANGED: 'ps', MEDIA_INFO_CHANGED: 'mi' },
    RemotePlayer: class { constructor() { this.isPaused = false; this.currentTime = 0; this.duration = 0; this.volumeLevel = 1; this.canSeek = true; this.playerState = 'PLAYING'; } },
    RemotePlayerController: class { constructor(player) { this.player = player; } addEventListener() {} playOrPause() { this.player.isPaused = !this.player.isPaused; } seek() {} setVolumeLevel() {} }
  }};
  window.chrome = { cast: { AutoJoinPolicy: { ORIGIN_SCOPED: 'origin' }, media: {
    DEFAULT_MEDIA_RECEIVER_APP_ID: 'CC1AD845',
    MediaInfo: class { constructor(url, type) { this.contentId = url; this.contentType = type; } },
    GenericMediaMetadata: class {},
    LoadRequest: class { constructor(media) { this.media = media; } },
    StreamType: { BUFFERED: 'BUFFERED' }
  }}};
  window.__onGCastApiAvailable(true);
});
await desktop.page.locator('#castBtn').click();
await desktop.page.locator('#castUrlInput').fill('https://example.com/movie.mp4');
await desktop.page.locator('#castTitleInput').fill('Película de prueba');
await desktop.page.locator('#startCastBtn').click();
await desktop.page.waitForSelector('#castStrip:not([hidden])');
if ((await desktop.page.locator('#castDeviceName').textContent()) !== 'TV Salón') throw new Error('El controlador Cast no mostró el dispositivo.');
if (desktop.errors.length) throw new Error(`Errores en escritorio: ${desktop.errors.join(' | ')}`);
await desktop.page.close();

const mobile = await boot({ width: 390, height: 844 });
const overflow = await mobile.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
await mobile.page.locator('#castBtn').click();
if (overflow) throw new Error('La vista móvil presenta desbordamiento horizontal.');
if (!(await mobile.page.locator('#modalTitle').isVisible())) throw new Error('El modal Cast no es visible en móvil.');
if (mobile.errors.length) throw new Error(`Errores en móvil: ${mobile.errors.join(' | ')}`);
await mobile.page.close();
await browser.close();
console.log('Smoke test PASS: inicio, navegación, Cast simulado y viewport móvil.');
