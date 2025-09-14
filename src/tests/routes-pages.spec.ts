import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { BUS_ROUTES } from '../utils/constants';
import * as common from '../assertions/common';
import * as schedule from '../assertions/routeSchedule';

test.describe('Route pages validation', () => {
  BUS_ROUTES.forEach((routeId) => {
    test.describe(`Route ${routeId}`, () => {
      const slug = `/plan-your-trip/routes/${routeId}`;

      test.beforeEach(async ({ page }) => {
        logNote(`Starting test for route ${routeId}`);
        await page.goto(slug);
        await common.closeSubscribePopup(page);
      });

      test(`loads without redirects`, async ({ page }) => {
        await common.watchForPageErrors(page);

        // Add thorough checks that we landed on the route page
        const finalUrl = page.url();
        const error404 = await page.locator('text=404').count();
        const errorMsg = await page.locator('text=error').count();
        const pageTitle = (await page.title()).trim();

        const finalUrlObj = new URL(finalUrl);
        const baseUrl = finalUrlObj.origin; // Get the base URL from the final URL
        const originalUrlObj = new URL(slug, baseUrl); // Construct the original URL properly
        const isBadRedirect = finalUrlObj.pathname !== originalUrlObj.pathname;

        // Verify page load
        expect.soft(error404, `Route ${routeId} there's no 404 error`).toBe(0);
        expect.soft(errorMsg, `Route ${routeId} there's no error message`).toBe(0);
        expect.soft(pageTitle, `Route ${routeId} has a page title`).toBeTruthy();
        expect.soft(finalUrl.includes('chrome-error://'), `Route ${routeId} has no chrome error`).toBeFalsy();
        expect.soft(isBadRedirect, `Route ${routeId} was not redirected from ${slug} to ${finalUrl}`).toBeFalsy();
      });

      test(`route timetable exists`, async ({ page }) => {
        // Verify the schedule table
        await schedule.checkRouteTable(page);
        await schedule.checkAmPmTimes(page);
        // await schedule.checkTimepointsToggle(page);
      });

      test(`page elements`, async ({ page }) => {
        // Check for required page elements
        await expect.soft(page.locator('a#download-link'), 'Download Schedule button should be visible').toBeVisible();

        const mapToggle = page
          .locator('div#route-map-container')
          .locator(`a:has-text("Open Route ${routeId} Map"):visible`);
        expect.soft(await mapToggle.count(), `Toggle map button should be visible`).toBeGreaterThan(0);
      });
    });
  });
});
