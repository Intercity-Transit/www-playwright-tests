import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as constants from '../utils/constants';
import * as common from '../assertions/common';
import * as header from '../assertions/header';
import * as footer from '../assertions/footer';

constants.basicPagesCollection.forEach((slug) => {
  test.describe(`Test common page elements`, () => {
    test(`validate [${slug}] elements`, async ({ page }) => {
      await page.goto(slug);
      await common.closeSubscribePopup(page);

      // Test page elements
      await expect
        .soft(async () => {
          await common.assertPageHasTitle(page);
        }, `${slug} should have a valid title tag`)
        .toPass();

      await expect
        .soft(async () => {
          await header.assertHeaderHasSearchForm(page);
        }, `${slug} header should contain a search form`)
        .toPass();

      await expect
        .soft(async () => {
          await footer.assertFooterHasCustomerService(page);
        }, `${slug} footer should contain customer service number`)
        .toPass();

      await expect
        .soft(async () => {
          await footer.assertFooterHasContactFormLink(page);
        }, `${slug} footer should contain contact form link`)
        .toPass();
    });
  });
});
