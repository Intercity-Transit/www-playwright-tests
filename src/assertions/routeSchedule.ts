import { test, expect, Page } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { takeScreenshot } from '../utils/screenshots';

/**
 * Check that the schedule table contains both AM and PM times.
 * @param page - Playwright page object
 */
export async function checkAmPmTimes(page: Page) {
  const timesTable = page.locator('#route-table table:visible');
  await expect.soft(timesTable, 'Route schedule should display AM departure times').toContainText(/(a\.m\.?|am)/i);
  await expect.soft(timesTable, 'Route schedule should display PM departure times').toContainText(/(p\.m\.?|pm)/i);
}

/**
 * Check that the schedule table has more than 5 visible rows.
 * @param page - Playwright page object
 */
export async function checkRouteTable(page: Page) {
  const timesTable = page.locator('#route-table table:visible');
  const visibleRows = timesTable.locator('tbody tr:visible');
  const rowCount = await visibleRows.count();

  await expect.soft(rowCount, `A route timetable should have more than 5 visible rows`).toBeGreaterThan(5);
  logNote(`There are ${rowCount} visible rows in the route's timetable`);
}

/**
 * Check that the schedule table contains specific text.
 * @param page - Playwright page object
 * @param text - Text to check for in the table
 */
export async function checkTableContainsText(page: Page, text: string) {
  const timesTable = page.locator('#route-table table:visible');
  await expect.soft(timesTable, `Route schedule should include "${text}"`).toContainText(text);
}

/**
 * Test "All stops" and "Timepoints" behavior on the table.
 * @param page - Playwright page object
 */
export async function checkTimepointsToggle(page: Page) {
  const timesTable = page.locator('#route-table table:visible');

  const getVisibleRowCount = async () => {
    return await timesTable.locator('tbody tr:visible').count();
  };

  // Expect all rows to start
  const initialRows = await getVisibleRowCount();

  await takeScreenshot(page, 'before clicking Timepoints screenshot', { fullPage: true });

  // Click "Timepoints" button
  await page.locator('label.btn:has-text("Timepoints"):visible').click();
  let timepointRows = await getVisibleRowCount();
  expect
    .soft(timepointRows, 'There should be fewer rows visible after clicking "Timepoints"')
    .toBeLessThan(initialRows);
  logNote(`There are ${timepointRows} visible rows in the route times table after clicking "Timepoints"`);

  await takeScreenshot(page, 'after clicking Timepoints screenshot', { fullPage: true });

  // Click "All Stops" button
  await page.locator('label.btn:has-text("All stops"):visible').click();
  let allRows = await getVisibleRowCount();
  expect.soft(allRows, 'All rows should be visible after clicking "All Stops"').toEqual(initialRows);
  logNote(`There are ${allRows} visible rows in the route times table after clicking "All Stops"`);

  await takeScreenshot(page, 'after clicking All Stops screenshot', { fullPage: true });
}
