import { test } from "../../global-setup";
import * as common from "../assertions/common";

const pages = [
  "/",
  "/contact",
  "/employment",
  "/bus/accessible-services",
  "/about-us/news-and-alerts",
  "/agency/transit-authority/meetings",
  "/plan-your-trip/routes",
  "/plan-your-trip/routes/41",
  "/how-to-ride/parks-by-bus"
];

pages.forEach((slug) => {
  const pageDisplayName = slug === "/" ? "homepage" : slug;

  test.describe(`Tests for ${pageDisplayName}`, () => {
    test(`page has no JavaScript errors`, async ({ page }) => {
      await page.goto(slug);
      await common.watchForPageErrors(page, slug);
      await common.closeSubscribePopup(page);
    });

    test(`page has no console errors`, async ({ page }) => {
      await page.goto(slug);
      await common.closeSubscribePopup(page);
      await common.watchForConsoleErrors(page, slug);
    });

    test(`page has no network response errors`, async ({ page }) => {
      await common.watchForNetworkErrors(page, slug);
    });
  });
});
