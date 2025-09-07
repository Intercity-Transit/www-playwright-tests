import { test, expect } from "../../global-setup";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as header from "../assertions/header";
import * as footer from "../assertions/footer";

const pages = [
  "/",
  "/contact",
  "/employment",
  "/bus/accessible-services",
  "/about-us/news-and-alerts",
];

pages.forEach((slug) => {
  const pageDisplayName = slug === "/" ? "homepage" : slug;

  test.describe(`Tests for ${pageDisplayName}`, () => {
    // Navigate to the specific page before each test.
    test.beforeEach(async ({ page }) => {
      await page.goto(slug);
      await common.closeSubscribePopup(page);
    });

    // Test title.
    test(`page has a title tag`, async ({ page }) => {
      await common.assertPageHasTitle(page);
    });

    // Test header search form.
    test("the header contains a search form @search", async ({ page }) => {
      await header.assertHeaderHasSearchForm(page);
    });

    // Test phone shows.
    test("footer contains customer service number", async ({ page }) => {
      await footer.assertFooterHasCustomerService(page);
    });

    // Test contact form link.
    test(`footer contains contact form link`, async ({
      page,
    }) => {
      await footer.assertFooterHasContactFormLink(page);
    });
  });
});
