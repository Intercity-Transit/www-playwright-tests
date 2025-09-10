import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as common from '../assertions/common';
import * as header from '../assertions/header';
import * as footer from '../assertions/footer';

test.describe(`Tests for search page @search`, () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await common.closeSubscribePopup(page);
  });

  // Complete search flow test - from header form to clicking results
  test('complete search workflow: form exists, search redirects, shows results, and can click result', async ({
    page,
  }, testInfo) => {
    // Step 1: Confirm the header search form exists
    await header.assertHeaderHasSearchForm(page);
    logNote('✓ Step 1: Header search form confirmed');

    // Step 2: Confirm entering text and hitting enter redirects
    const searchInput = page.locator('.region-header-top input[type="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('wheel');

    // Take screenshot
    let screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('search input', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Wait for navigation to complete after pressing Enter
    await Promise.all([page.waitForNavigation(), searchInput.press('Enter')]);
    await expect(page).toHaveURL(/search\/wheel/);
    logNote('✓ Step 2: Search redirect confirmed');

    await common.closeSubscribePopup(page);

    // Step 3: Confirm search page shows results (more than 2)
    const results = page.locator('div.main-container h3 > a');
    const count = await results.count();
    expect(count).toBeGreaterThan(2);
    logNote(`✓ Step 3: Found ${count} search results`);

    // Take screenshot
    screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('search results', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Step 4: Confirm we can click and goto the first result
    const firstResult = results.first();
    await expect(firstResult).toBeVisible();

    // Get the href for verification
    const href = await firstResult.getAttribute('href');
    await firstResult.click();

    await common.closeSubscribePopup(page);

    // Verify we navigated to the clicked result
    await expect(page).toHaveURL(new RegExp(href!));
    logNote(`✓ Step 4: Successfully clicked and navigated to: ${href}`);

    // Take screenshot
    screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('search result article', {
      body: screenshot,
      contentType: 'image/png',
    });
  });
});
