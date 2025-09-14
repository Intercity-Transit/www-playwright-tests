import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { takeScreenshot } from '../utils/screenshots';
import * as common from '../assertions/common';
import * as header from '../assertions/header';
import * as footer from '../assertions/footer';

test.describe(`Tests for search page @search`, () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    logNote('Starting search page test');
    await page.goto('/');
    await common.closeSubscribePopup(page);
  });

  // Complete search flow test - from header form to clicking results
  test('complete search workflow: form exists, search redirects, shows results, and can click result', async ({
    page,
  }, testInfo) => {
    // Step 1: Confirm the header search form exists
    await header.assertHeaderHasSearchForm(page);
    logNote('Header search form confirmed');

    // Step 2: Confirm entering text and hitting enter redirects
    const searchInput = page.locator('.region-header-top input[type="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('wheel');

    await takeScreenshot(page, 'search input filled');

    // Wait for navigation to complete after pressing Enter
    await Promise.all([page.waitForNavigation(), searchInput.press('Enter')]);
    await expect(page).toHaveURL(/search\/wheel/);
    logNote('Search redirect confirmed');

    await common.closeSubscribePopup(page);
    await takeScreenshot(page, 'search results', { fullPage: true });

    // Step 3: Confirm search page shows results (more than 2)
    const results = page.locator('div.main-container h3 > a');
    const count = await results.count();
    expect(count).toBeGreaterThan(2);
    logNote(`Found ${count} search results`);

    // Step 4: Confirm we can click and goto the first result
    const firstResult = results.first();
    await expect(firstResult).toBeVisible();

    // Get the href for verification
    const href = await firstResult.getAttribute('href');
    await firstResult.click();

    await common.closeSubscribePopup(page);

    // Verify we navigated to the clicked result
    await expect(page).toHaveURL(new RegExp(href!));
    logNote(`Successfully clicked and navigated to: ${href}`);

    await takeScreenshot(page, 'search result article');
  });
});
