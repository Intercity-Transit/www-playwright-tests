import { test, expect, Page, Locator } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as common from '../assertions/common';
import * as footer from '../assertions/footer';
import * as schedule from '../assertions/routeSchedule';

const routeId = '21';

test.describe(`Tests for route ${routeId} page @routes`, () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    logNote(`Starting route ${routeId} page test`);
    await page.goto(`/plan-your-trip/routes/${routeId}`);
    await common.closeSubscribePopup(page);
  });

  test('Test the route page information @routes', async ({ page }) => {
    // Verify the schedule table
    await schedule.checkRouteTable(page);
    await schedule.checkAmPmTimes(page);

    // Verify special times
    await schedule.checkTableContainsText(page, '6:00 a.m.');
    await schedule.checkTableContainsText(page, '10:12 p.m.');

    // Verify key stops are included
    await schedule.checkTableContainsText(page, 'Olympia Transit Center');
    await schedule.checkTableContainsText(page, 'Friendly Grove at 26th Ave');
  });

  test('Test the schedule behavior on a route page @routes', async ({ page }) => {
    await schedule.checkTimepointsToggle(page);
  });
});
