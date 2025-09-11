import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { BUS_ROUTES } from '../utils/constants';
import * as common from '../assertions/common';

test.describe(`Test each route page @routes`, () => {
  BUS_ROUTES.forEach((routeId) => {
    test(`Route ${routeId} page loads correctly`, async ({ page }) => {
      const routeUrl = `/plan-your-trip/routes/${routeId}`;

      await page.goto(routeUrl);
      await common.closeSubscribePopup(page);

      const finalUrl = page.url();
      const error404 = await page.locator('text=404').count();
      const errorMsg = await page.locator('text=error').count();
      const pageTitle = (await page.title()).trim();

      // Check if redirect is to a different route (bad redirect)
      const finalUrlObj = new URL(finalUrl);
      const baseUrl = finalUrlObj.origin; // Get the base URL from the final URL
      const originalUrlObj = new URL(routeUrl, baseUrl); // Construct the original URL properly
      const isBadRedirect = finalUrlObj.pathname !== originalUrlObj.pathname;

      // Verify page loaded successfully
      expect.soft(error404, `Route ${routeId} shows 404 error`).toBe(0);
      expect.soft(errorMsg, `Route ${routeId} shows error message`).toBe(0);
      expect.soft(pageTitle, `Route ${routeId} has no page title`).toBeTruthy();
      expect.soft(finalUrl.includes('chrome-error://'), `Route ${routeId} has chrome error`).toBeFalsy();
      expect.soft(isBadRedirect, `Route ${routeId} was redirected from ${routeUrl} to ${finalUrl}`).toBeFalsy();

      // Check for required page elements
      await expect.soft(page.locator('a#download-link'), 'Download Schedule button should be visible').toBeVisible();

      const mapToggle = page
        .locator('div#route-map-container')
        .locator(`a:has-text("Open Route ${routeId} Map"):visible`);
      expect.soft(await mapToggle.count(), `Route ${routeId} page should have a visible map toggle`).toBeGreaterThan(0);

      // Verify the schedule table
      const timesTable = page.locator('#route-table table:visible');
      const visibleRows = timesTable.locator('tbody tr:visible');
      const rowCount = await visibleRows.count();
      logNote(`Route ${routeId} has ${rowCount} visible rows in the schedule table`);

      await expect.soft(timesTable, `Route ${routeId} should have a visible schedule table`).toBeVisible();
      await expect.soft(rowCount, `Route ${routeId} should have more than 5 visible rows`).toBeGreaterThan(5);
      await expect.soft(timesTable, 'Route schedule should display AM departure times').toContainText(/(a\.m\.?|am)/i);
      await expect.soft(timesTable, 'Route schedule should display PM departure times').toContainText(/(p\.m\.?|pm)/i);
    });
  });
});
