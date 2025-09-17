import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { takeScreenshot } from '../utils/screenshots';
import * as common from '../assertions/common';
import * as footer from '../assertions/footer';

test.describe(`Tests for the homepage`, () => {
  // Before each test, navigate to the homepage and close any popups
  test.beforeEach(async ({ page }) => {
    logNote('Starting homepage test');
    await page.goto('/');
    await common.closeSubscribePopup(page);
  });

  test('main page elements test', async ({ page }) => {
    await takeScreenshot(page, 'homepage loaded', { fullPage: true });

    // Test frequent tasks section
    const frequentTasksHeading = page.locator('h2:has-text("Frequent Tasks")');
    await expect.soft(frequentTasksHeading, 'Heading with "Frequent Tasks" should be visible').toBeVisible();

    const frequentTasksCount = await page.locator('div.view-id-home_featured_tasks div.homeFeaturedLinks').count();
    await expect.soft(frequentTasksCount, 'page should show at least 5 Frequent Tasks').toBeGreaterThanOrEqual(5);
    logNote(`Number of frequent tasks found: ${frequentTasksCount}`);

    // Test news section
    const newsHeading = page.locator('#block-views-block-news-block-1 h2:has-text("News")');
    await expect.soft(newsHeading, 'Heading with "News" should be visible').toBeVisible();

    const newsLinksCount = await page.locator('#block-views-block-news-block-1 a').count();
    await expect.soft(newsLinksCount, 'News block should contain at least 4 news links').toBeGreaterThanOrEqual(4);
    logNote(`Number of news links found: ${newsLinksCount}`);
  });

  test('routes section elements test', async ({ page }) => {
    // Test schedules link
    const schedulesLink = page.locator('div.main-container a[href="/plan-your-trip/routes"]:has-text("Bus Schedules")');
    await expect.soft(schedulesLink, 'page should have a visible Bus Schedules link').toBeVisible();

    // Test routes count
    const routes = await page.$$eval('#route-form-container select#edit-routes option', (options) =>
      options.map((option) => option.textContent)
    );
    const routesCount = routes.length;

    await expect.soft(routesCount, 'Bus routes list should show at least 18 items').toBeGreaterThanOrEqual(18);
    logNote(`Number of routes found: ${routesCount}`);

    // Log the routes shown
    const routeList = routes
      .filter(Boolean)
      .map((r) => r?.trim())
      .join('\n');
    logNote(`Routes listed:\n${routeList}`);

    // Test "Select a Stop" has items
    await page.locator('#block-routeandtripformsblock ul.nav >> text=Stops').click();
    const stops = await page.$$eval('select#edit-stop option', (opts) => opts.map((o) => o.textContent));
    await expect.soft(stops.length, '"Select a Stop" should show at least 100 items').toBeGreaterThanOrEqual(100);
    logNote(`Number of stops found: ${stops.length}`);
  });
});
