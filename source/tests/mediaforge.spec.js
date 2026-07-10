import { test, expect } from '@playwright/test';

async function enterApp(page) {
  await page.route('https://www.gstatic.com/**', route => route.abort());
  await page.goto('./');
  await expect(page.locator('.app-shell')).toBeVisible();
  const legal = page.locator('#acceptLegalBtn');
  await legal.waitFor({ state: 'visible', timeout: 2500 }).catch(() => {});
  if (await legal.isVisible().catch(() => false)) await legal.click();
  await expect(page.locator('#modalBackdrop')).not.toHaveClass(/open/);
}

async function goToView(page, view) {
  const mobileMenu = page.locator('#mobileMenu');
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.locator(`[data-view="${view}"]`).click();
  await expect(page.locator(`[data-view-panel="${view}"]`)).toHaveClass(/active/);
}



test('pantalla completa elimina límites, marcos y ocupa todo el viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'Fullscreen real se valida en escritorio; Safari móvil usa fullscreen nativo de vídeo');
  await enterApp(page);
  await page.locator('#mediaInput').setInputFiles('tests/fixtures/tone.wav');
  await page.locator('[data-player-mode="crt"]').click().catch(() => {});
  await page.locator('#fullscreenBtn').click();
  await expect.poll(async () => page.evaluate(() => Boolean(document.fullscreenElement))).toBeTruthy();
  const geometry = await page.locator('#playerStage').evaluate(el => {
    const rect = el.getBoundingClientRect();
    const media = document.querySelector('#mediaElement').getBoundingClientRect();
    const style = getComputedStyle(el);
    const mediaStyle = getComputedStyle(document.querySelector('#mediaElement'));
    return {
      width: rect.width, height: rect.height,
      viewportWidth: innerWidth, viewportHeight: innerHeight,
      mediaWidth: media.width, mediaHeight: media.height,
      radius: style.borderRadius, border: style.borderTopWidth,
      maxHeight: mediaStyle.maxHeight
    };
  });
  expect(Math.abs(geometry.width - geometry.viewportWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.height - geometry.viewportHeight)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.mediaWidth - geometry.viewportWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.mediaHeight - geometry.viewportHeight)).toBeLessThanOrEqual(1);
  expect(geometry.radius).toBe('0px');
  expect(geometry.border).toBe('0px');
  expect(geometry.maxHeight).toBe('none');
  await page.keyboard.press('Escape');
  await expect.poll(async () => page.evaluate(() => Boolean(document.fullscreenElement))).toBeFalsy();
});

test('carga la aplicación sin errores críticos y navega por todas las áreas', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await enterApp(page);
  await goToView(page, 'library');
  await expect(page.locator('#libraryEmptyOpenBtn')).toBeVisible();
  for (const view of ['audio', 'converter', 'inspector', 'settings', 'player']) await goToView(page, view);
  expect(errors).toEqual([]);
});

test('aplica skins y los nuevos modos VHS, Cyberpunk y Minimal', async ({ page }) => {
  await enterApp(page);
  await goToView(page, 'settings');
  await page.locator('[data-skin="cyberpurple"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-u404-skin', 'cyberpurple');
  for (const mode of ['vhs', 'cyberpunk', 'minimal']) {
    await page.locator(`[data-player-mode="${mode}"]`).click();
    await expect(page.locator('html')).toHaveAttribute('data-player-mode', mode);
  }
});

test('crea biblioteca local con progreso, etiquetas y colecciones', async ({ page }) => {
  await enterApp(page);
  await page.locator('#mediaInput').setInputFiles('tests/fixtures/tone.wav');
  await goToView(page, 'library');
  await expect(page.locator('.library-item')).toHaveCount(1);
  await page.locator('[data-library-edit]').click();
  await page.locator('#editCollection').fill('Pruebas');
  await page.locator('#editTags').fill('audio, test');
  await page.locator('#saveLibraryMetaBtn').click();
  await expect(page.locator('#modalBackdrop')).not.toHaveClass(/open/);
  await expect(page.locator('.collection-badge')).toHaveText('Pruebas');
  await expect(page.locator('.library-badges')).toContainText('#audio');
});

test('inspector calcula metadatos y huella SHA-256', async ({ page }) => {
  await enterApp(page);
  await goToView(page, 'inspector');
  await page.locator('#inspectorInput').setInputFiles('tests/fixtures/tone.wav');
  await expect(page.locator('#inspectName')).toHaveText('tone.wav');
  await page.locator('#checksumBtn').click();
  await expect(page.locator('#metadataGrid')).toContainText('SHA-256');
  await expect(page.locator('#diagnosticCards')).toContainText('Calculada');
});



test('convertidor FFmpeg bajo demanda genera un MP3 descargable', async ({ page }, testInfo) => {
  test.skip(process.env.MEDIAFORGE_TEST_FFMPEG !== '1' || testInfo.project.name.includes('mobile'), 'Activa MEDIAFORGE_TEST_FFMPEG=1 para probar la descarga externa del núcleo WASM');
  await enterApp(page);
  await goToView(page, 'converter');
  await page.locator('#converterInput').setInputFiles('tests/fixtures/tone.wav');
  await page.locator('#convertPreset').selectOption('mp3');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#convertBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/tone\.mp3$/i);
  await expect(page.locator('#progressPercent')).toHaveText('100%', { timeout: 60_000 });
});

test('FFmpeg bajo demanda analiza y valida un archivo real', async ({ page }, testInfo) => {
  test.skip(process.env.MEDIAFORGE_TEST_FFMPEG !== '1' || testInfo.project.name.includes('mobile'), 'Activa MEDIAFORGE_TEST_FFMPEG=1 para probar la descarga externa del núcleo WASM');
  await enterApp(page);
  await goToView(page, 'inspector');
  await page.locator('#inspectorInput').setInputFiles('tests/fixtures/tone.wav');
  await page.locator('#deepInspectBtn').click();
  await expect(page.locator('#deepOutput')).toContainText(/Audio|Contenedor|WAV/i, { timeout: 60_000 });
  await page.locator('#validateMediaBtn').click();
  await expect(page.locator('#validationOutput')).toContainText(/VALIDACIÓN|CORRECTA|Advertencias/i, { timeout: 60_000 });
  await page.locator('#repairMediaBtn').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#startRepairBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/reparado\.mka$/i);
  await expect(page.locator('#validationOutput')).toContainText('COPIA REPARADA', { timeout: 60_000 });
});

test('los recursos PWA y Cast Bridge están incluidos en el proyecto ligero', async ({ request }) => {
  for (const path of ['./manifest.webmanifest', './sw.js', './cast-bridge/MediaForgeCastBridge.py', './cast-bridge/START_CAST_BRIDGE.bat', './cast-bridge/README.html']) {
    const response = await request.get(path);
    expect(response.ok(), path).toBeTruthy();
  }
});

test('el panel de transmisión explica Cast, AirPlay y el Bridge sin botones decorativos', async ({ page }) => {
  await enterApp(page);
  await expect(page.locator('#castBtn')).toBeVisible();
  await page.locator('#castBtn').click();
  await expect(page.locator('#modalTitle')).toHaveText('Transmitir a una pantalla');
  await expect(page.locator('.cast-modal-body')).toContainText('Google Cast');
  await expect(page.locator('.cast-modal-body')).toContainText('MediaForge Cast Bridge');
  await page.locator('#castBridgeGuideBtn').click();
  await expect(page.locator('#modalTitle')).toHaveText('MediaForge Cast Bridge');
  await expect(page.locator('a[href="./cast-bridge/MediaForgeCastBridge.py"]')).toBeVisible();
});

test('la vista móvil no produce desbordamiento horizontal', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'Comprobación específica del proyecto móvil');
  await enterApp(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBeFalsy();
  await page.locator('#mobileMenu').click();
  await expect(page.locator('#sidebar')).toHaveClass(/open/);
});
