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

  test('page elements test', async ({ page }) => {
    await takeScreenshot(page, 'homepage loaded', { fullPage: true });

    // Extract locators
    const frequentTasksHeading = page.locator('h2:has-text("Frequent Tasks")');
    const frequentTasksItems = page.locator('div.view-id-home_featured_tasks div.homeFeaturedLinks');
    const busSchedulesLink = page.locator(
      'div.main-container a[href="/plan-your-trip/routes"]:has-text("Bus Schedules")'
    );

    // Test page elements
    await expect.soft(frequentTasksHeading, 'Heading with "Frequent Tasks" should be visible').toBeVisible();

    const count = await frequentTasksItems.count();
    await expect.soft(count, 'page should show at least 5 Frequent Tasks').toBeGreaterThanOrEqual(5);
    logNote(`Number of frequent tasks found: ${count}`);

    await expect.soft(busSchedulesLink, 'Bus Schedules link should be visible in main container').toBeVisible();
  });

  test('homepage bus information test', async ({ page }) => {
    // Extract locators
    const schedulesLink = page.locator('div.main-container a[href="/plan-your-trip/routes"]:has-text("Bus Schedules")');

    // Test schedules link
    await expect.soft(schedulesLink, 'page should have a visible Bus Schedules link').toBeVisible();

    // Test routes count
    const routes = await page.$$eval('#route-form-container select#edit-routes option', (options) =>
      options.map((option) => option.textContent)
    );
    const routesCount = routes.length;

    await expect.soft(routesCount, 'should show at least 18 routes').toBeGreaterThanOrEqual(18);
    logNote(`Number of routes found: ${routesCount}`);

    // Log the routes shown
    const routeList = routes
      .filter(Boolean)
      .map((r) => r?.trim())
      .join('\n');
    logNote(`Routes listed:\n${routeList}`);
  });
});
