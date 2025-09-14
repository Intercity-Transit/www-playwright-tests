import { test as base, expect } from '@playwright/test';
import { logNote } from './src/utils/logNote';

// Extend the base test to include global hooks
export const test = base.extend({});

// Add global beforeEach hook
test.beforeEach(async ({ page }, testInfo) => {
  // Add URL annotation at start of test
  logNote(`Beginning URL → ${page.url()}`);

  // Listen to all navigation events
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      logNote(`Navigation → ${frame.url()}`);
    }
  });
});

// Add global afterEach hook
test.afterEach(async ({ page }, testInfo) => {
  // Always log test completion status first
  logNote(`Test completed with status: ${testInfo.status}`);

  // Take a screenshot after each test
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach('final-screenshot', {
    body: screenshot,
    contentType: 'image/png',
  });
  logNote(`Screenshot taken for test: ${testInfo.title}`);
});

export { expect, Page, Locator } from '@playwright/test';
