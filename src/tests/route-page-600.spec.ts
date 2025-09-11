import { test, expect, Page, Locator } from '../../global-setup';
import * as common from '../assertions/common';
import * as footer from '../assertions/footer';
import { logNote } from '../utils/logNote';

// Helper function to locate the times table.
async function getTable(page: Page): Promise<Locator> {
  const table = page.locator('#route-table table').last();

  // Soft expect that the routes table exists
  await expect.soft(table, 'Routes table should be present').toBeVisible();

  return table;
}

test.describe('Tests for route 600 page @routes', () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto('/plan-your-trip/routes/600');
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
      page.waitForResponse(response => response.status() === 200),
      downloadButton.click()
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

    await expect.soft(timesTable, 'Route should include 5:03 a.m. departure time').toContainText('5:03 a.m.');
    await expect.soft(timesTable, 'Route should include 8:49 p.m. departure time').toContainText('8:49 p.m.');

    // Verify key stops are included
    await expect
      .soft(timesTable, 'Route should include Olympia Transit Center as a stop')
      .toContainText('Olympia Transit Center');

    // Verify specific stops and times are present
    await expect
      .soft(timesTable, 'Route should include Lakewood Station Bay 5 as a stop')
      .toContainText('Lakewood Station Bay 5');
  });

  test('Test the time-table behavior @routes', async ({ page }) => {
    /***
     * We have two times tables on the page. One for each direction of travel.
     * Let's test the second table (the default one) for "All stops" and "Timepoints".
     */

    const tables = page.locator('#route-table table');
    await expect.soft(tables, 'There should be two route times tables').toHaveCount(2);
    const table = tables.nth(1); // Get the second table


    const getVisibleRowCount = async () => {
      return await table.locator('tbody tr:visible').count();
    };

    // Expect all rows to start
    let visibleCount = await getVisibleRowCount();
    expect.soft(visibleCount, 'There should be 10+ table rows visible by default').toBeGreaterThan(10);
    logNote(`There are ${visibleCount} visible rows in the route times table`);

    // Click the Timepoints button
    const timepointsButton = page.locator('label.btn:has-text("Timepoints"):visible');
    await timepointsButton.click();
    let visibleCountAfterTimepoints = await getVisibleRowCount();
    expect
    .soft(visibleCountAfterTimepoints, 'There should be fewer rows visible after clicking Timepoints')
    .toBeLessThan(visibleCount);

    logNote(`There are ${visibleCountAfterTimepoints} visible rows in the route times table after clicking Timepoints`);

    // Click the All Stops button
    const allStopsButton = page.locator('label.btn:has-text("All stops"):visible');
    await allStopsButton.click();
    let visibleCountAfterAllStops = await getVisibleRowCount();
    expect.soft(visibleCountAfterAllStops, 'All rows should be visible after clicking All Stops').toEqual(visibleCount);

    logNote(`There are ${visibleCountAfterAllStops} visible rows in the route times table after clicking All Stops`);
  });
});
