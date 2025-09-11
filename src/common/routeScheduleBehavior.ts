import { test, expect, Page } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { takeScreenshot } from './screenshots';

/**
 * Test the schedule behavior on a route page.
 * @param page - Playwright page object
 */
export async function testRouteScheduleBehavior(page: Page) {
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
  expect.soft(visibleCount, 'There should be 5+ table rows visible by default').toBeGreaterThan(5);
  logNote(`There are ${visibleCount} visible rows in the route times table`);

  await takeScreenshot(page, 'before clicking screenshot');

  // Click the Timepoints button
  const timepointsButton = page.locator('label.btn:has-text("Timepoints"):visible');
  await timepointsButton.click();
  let visibleCountAfterTimepoints = await getVisibleRowCount();
  expect
    .soft(visibleCountAfterTimepoints, 'There should be fewer rows visible after clicking Timepoints')
    .toBeLessThan(visibleCount);
  logNote(`There are ${visibleCountAfterTimepoints} visible rows in the route times table after clicking Timepoints`);

  await takeScreenshot(page, 'after clicking "Timepoints" screenshot');

  // Click the All Stops button
  const allStopsButton = page.locator('label.btn:has-text("All stops"):visible');
  await allStopsButton.click();
  let visibleCountAfterAllStops = await getVisibleRowCount();
  expect.soft(visibleCountAfterAllStops, 'All rows should be visible after clicking All Stops').toEqual(visibleCount);
  logNote(`There are ${visibleCountAfterAllStops} visible rows in the route times table after clicking All Stops`);

  await takeScreenshot(page, 'after clicking "All Stops" screenshot');
}
