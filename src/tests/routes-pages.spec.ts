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
      await expect.soft(
        page.locator('nav[aria-label="Breadcrumb"]'),
        `Route ${routeId} page should have breadcrumb navigation`
      ).toBeVisible();

      await expect.soft(
        page.locator('a#download-link[href*="/sites/default/files/"]'),
        `Route ${routeId} page should have download schedule link`
      ).toBeVisible();

      await expect.soft(
        page.locator('#route-table table').first(),
        `Route ${routeId} page should have route times table`
      ).toBeVisible();

      await expect.soft(
        page.locator(`text="Open Route ${routeId} Map"`),
        `Route ${routeId} page should have map toggle`
      ).toBeVisible();
    });
  });
});
