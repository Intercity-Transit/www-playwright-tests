import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 60000, // 60 seconds per test
  reporter: [['list'], ['html', { outputFolder: 'test-results', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.intercitytransit.com',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'off', // Disable automatic screenshots since we handle them manually
    actionTimeout: 10000, // 10 seconds for actions
    navigationTimeout: 30000, // 30 seconds for navigation
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
