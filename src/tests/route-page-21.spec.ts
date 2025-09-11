import { test, expect, Page, Locator } from '../../global-setup';
import * as common from '../assertions/common';
import * as footer from '../assertions/footer';
import { logNote } from '../utils/logNote';
import { testRouteScheduleBehavior } from '../common/routeScheduleBehavior';

// Helper function to locate the times table.
async function getTable(page: Page): Promise<Locator> {
  const table = page.locator('#route-table table').last();

  // Soft expect that the routes table exists
  await expect.soft(table, 'Routes table should be present').toBeVisible();

  return table;
}

test.describe('Tests for route 21 page @routes', () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto('/plan-your-trip/routes/21');
    await common.closeSubscribePopup(page);
  });

  test('Test the route page information @routes', async ({ page }) => {
    // Find schedule download button
    const downloadButton = page.locator('a#download-link.btn');
    await expect.soft(downloadButton, 'Download button for route schedule should be present').toBeVisible();
    await expect
      .soft(downloadButton, 'Download button should contain "Download Schedule" text')
      .toContainText('Download Schedule');

    // Click the download button
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.status() === 200),
      downloadButton.click(),
    ]);

    expect.soft(response.url(), 'Download URL should contain .pdf').toContain('.pdf');
    expect.soft(response.status(), 'Download should not return 404').not.toBe(404);
    expect.soft(response.ok(), 'Download response should be successful').toBe(true);

    // Get the table, after ajax load
    const timesTable = await getTable(page);

    // Verify times are present
    await expect.soft(timesTable, 'Route schedule should display AM departure times').toContainText(/(a\.m\.?|am)/i);
    await expect.soft(timesTable, 'Route schedule should display PM departure times').toContainText(/(p\.m\.?|pm)/i);

    // Verify special times

    await expect.soft(timesTable, 'Route should include 6:00 a.m. departure time').toContainText('6:00 a.m.');
    await expect.soft(timesTable, 'Route should include 10:12 p.m. departure time').toContainText('10:12 p.m.');

    // Verify key stops are included
    await expect
      .soft(timesTable, 'Route should include Olympia Transit Center as a stop')
      .toContainText('Olympia Transit Center');

    // Verify specific stops and times are present
    await expect
      .soft(timesTable, 'Route should include Friendly Grove at 26th Ave as a stop')
      .toContainText('Friendly Grove at 26th Ave');
  });

  test('Test the schedule behavior on a route page @routes', async ({ page }) => {
    await testRouteScheduleBehavior(page, true);
  });
});
