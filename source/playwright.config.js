import { defineConfig, devices } from '@playwright/test';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const externalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: { ...(executablePath ? { executablePath } : {}), args: process.env.CI ? ['--no-sandbox'] : [] }
  },
  webServer: externalServer ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }
  ]
});
