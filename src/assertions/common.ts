import { Page, expect } from '@playwright/test';
import { logNote } from '../utils/logNote';

export async function assertPageHasTitle(page: Page) {
  await expect(page).toHaveTitle(/Intercity Transit/i);
}

export async function closeSubscribePopup(page: Page) {
  // Press escape just in case
  await page.keyboard.press('Escape');

  const closeButton = page.locator('#prefix-overlay-header button');

  try {
    // Wait up to 5s for popup
    if (await closeButton.isVisible({ timeout: 5000 })) {
      await closeButton.click();
      // Wait until modal disappears
      await closeButton.waitFor({ state: 'detached', timeout: 5000 });
    }
  } catch (e) {
    // No popup appeared — safe to ignore
  }
}

/**
 * Capture uncaught JavaScript exceptions on the page.
 */
export async function watchForPageErrors(page: Page) {
  const jsErrors: string[] = [];

  page.on('pageerror', (err) => {
    jsErrors.push(err.message);
  });

  // Let scripts run
  await page.waitForTimeout(1000);

  if (jsErrors.length > 0) {
    jsErrors.forEach((msg) => logNote(`JavaScript error: ${msg}`));
  }

  expect.soft(jsErrors.length, `Expect no JavaScript errors`).toBe(0);
}

/**
 * Capture console error logs from the page.
 */
export async function watchForConsoleErrors(page: Page, slug: string) {
  const consoleErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.waitForTimeout(1000);

  if (consoleErrors.length > 0) {
    consoleErrors.forEach((msg) => logNote(`Console error on ${slug}: ${msg}`));
  }

  expect.soft(consoleErrors.length, `Console errors detected on ${slug}`).toBe(0);
}

/**
 * Capture network responses with 4xx/5xx status codes and failed requests.
 */
export async function watchForNetworkErrors(page: Page, slug: string) {
  const badResponses: string[] = [];
  const failedRequests: string[] = [];

  page.on('response', (response) => {
    if (response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  page.on('requestfailed', (request) => {
    failedRequests.push(`Failed request: ${request.url()} - ${request.failure()?.errorText}`);
  });

  // Navigate to the page after setting up listeners
  await page.goto(slug);

  // Allow network to settle
  await page.waitForTimeout(1500);

  const allErrors = [...badResponses, ...failedRequests];

  if (allErrors.length > 0) {
    allErrors.forEach((msg) => logNote(`Network error on ${slug}: ${msg}`));
  }

  expect.soft(allErrors.length, `Network response errors detected on ${slug}`).toBe(0);
}
