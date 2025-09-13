import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as constants from '../utils/constants';
import * as common from '../assertions/common';
import * as header from '../assertions/header';
import * as footer from '../assertions/footer';

constants.basicPagesCollection.forEach((slug) => {
  test.describe(`Test common page elements for ${slug}`, () => {
    test.beforeEach(async ({ page }) => {
      logNote(`Starting test for page ${slug}`);
      await page.goto(slug);
      await common.closeSubscribePopup(page);
    });

    test(`validate elements`, async ({ page }) => {
      // Test page status
      await expect
        .soft(async () => {
          const response = page.url() ? await page.goto(page.url()) : null;
          expect(response?.status()).toBeLessThan(400);
        }, `${slug} should not return 4xx or 5xx status code`)
        .toPass();

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

      await expect
        .soft(async () => {
          const contentDiv = page.locator('div.region-content');
          const textContent = await contentDiv.textContent();
          const wordCount = textContent?.trim().split(/\s+/).length || 0;
          expect(wordCount).toBeGreaterThanOrEqual(100);
        }, `${slug} should have at least 100 words of content`)
        .toPass();
    });
  });
});
