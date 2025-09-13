import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  reporter: [['list'], ['html', { outputFolder: 'test-results', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://test-intercity-transit.pantheonsite.io/',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
