import { test } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as constants from '../utils/constants';
import * as common from '../assertions/common';

constants.basicPagesCollection.forEach((slug) => {
  test.describe(`Health tests for [${slug}]`, () => {
    test(`page has no JavaScript errors`, async ({ page }) => {
      logNote(`Starting JavaScript error check for page ${slug}`);
      await page.goto(slug);
      await common.watchForPageErrors(page, slug);
    });

    test(`page has no console errors`, async ({ page }) => {
      logNote(`Starting console error check for page ${slug}`);
      await page.goto(slug);
      await common.watchForConsoleErrors(page, slug);
    });

    test(`page has no network response errors`, async ({ page }) => {
      logNote(`Starting network error check for page ${slug}`);
      // Note: This test handles navigation internally
      await common.watchForNetworkErrors(page, slug);
    });
  });
});
