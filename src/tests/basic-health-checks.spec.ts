import { test } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as constants from '../utils/constants';
import * as common from '../assertions/common';

constants.basicPagesCollection.forEach((slug) => {
  test.describe(`Health tests for [${slug}]`, () => {
    test(`page loads without JavaScript errors`, async ({ page }) => {
      logNote(`Starting JavaScript error check for page ${slug}`);
      await page.goto(slug);
      await common.watchForPageErrors(page);
    });

    test(`page loads without console errors`, async ({ page }) => {
      logNote(`Starting console error check for page ${slug}`);
      await page.goto(slug);
      await common.watchForConsoleErrors(page, slug);
    });

    test(`page loads without network errors`, async ({ page }) => {
      logNote(`Starting network error check for page ${slug}`);
      // Note: This test handles navigation internally
      await common.watchForNetworkErrors(page, slug);
    });
  });
});
