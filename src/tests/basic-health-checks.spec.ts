import { test } from '../../global-setup';
import * as constants from '../utils/constants';
import * as common from '../assertions/common';

constants.basicPagesCollection.forEach((slug) => {
  test.describe(`Health tests for [${slug}]`, () => {
    test(`page has no JavaScript errors`, async ({ page }) => {
      await page.goto(slug);
      await common.watchForPageErrors(page, slug);
    });

    test(`page has no console errors`, async ({ page }) => {
      await page.goto(slug);
      await common.watchForConsoleErrors(page, slug);
    });

    test(`page has no network response errors`, async ({ page }) => {
      await common.watchForNetworkErrors(page, slug);
    });
  });
});
