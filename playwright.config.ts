import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173';
export const API_URL = process.env.API_URL ?? 'http://localhost:3000/api/v1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'fr-FR',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // baseURL se termine par "/" pour que request.get('health') => /api/v1/health
        baseURL: API_URL.endsWith('/') ? API_URL : `${API_URL}/`,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: WEB_URL },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: WEB_URL },
    },
  ],
});
