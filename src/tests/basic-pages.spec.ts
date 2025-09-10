import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as common from '../assertions/common';
import * as header from '../assertions/header';
import * as footer from '../assertions/footer';

const pages = ['/', '/contact', '/employment', '/bus/accessible-services', '/about-us/news-and-alerts'];

test.describe('Basic pages validation', () => {
  pages.forEach((slug) => {
    const pageDisplayName = slug === '/' ? 'homepage' : slug;

    test(`validate [${pageDisplayName}] page elements`, async ({ page }) => {
      await logNote(`Testing page: ${pageDisplayName}`);

      // Navigate to the page
      await page.goto(slug);
      await common.closeSubscribePopup(page);

      // Test page elements
      await expect
        .soft(async () => {
          await common.assertPageHasTitle(page);
        }, `${pageDisplayName} should have a valid title tag`)
        .toPass();

      await expect
        .soft(async () => {
          await header.assertHeaderHasSearchForm(page);
        }, `${pageDisplayName} header should contain a search form`)
        .toPass();

      await expect
        .soft(async () => {
          await footer.assertFooterHasCustomerService(page);
        }, `${pageDisplayName} footer should contain customer service number`)
        .toPass();

      await expect
        .soft(async () => {
          await footer.assertFooterHasContactFormLink(page);
        }, `${pageDisplayName} footer should contain contact form link`)
        .toPass();
    });
  });
});
