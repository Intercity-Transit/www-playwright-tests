import { test, expect } from "../../global-setup";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";

const pages = ["/"];

pages.forEach((slug) => {
  test.describe(`Tests for home page bus routes (@routes)`, () => {
    // Navigate to the specific page before each test.
    test.beforeEach(async ({ page }) => {
      await page.goto(slug);
      await common.closeSubscribePopup(page);
    });

    // Test schedules link.
    test("there's a Bus Schedules link", async ({ page }) => {
      const link = page.locator(
        'div.main-container a[href="/plan-your-trip/routes"]:has-text("Bus Schedules")'
      );
      await expect(link).toBeVisible();
    });

    // Test routes count.
    test("page shows routes list", async ({ page }) => {
      const routes = await page.$$eval(
        "#route-form-container select#edit-routes option",
        (options) => options.map((option) => option.textContent)
      );
      expect(routes.length).toBeGreaterThanOrEqual(18);
      logNote(`Number of routes found: ${routes.length}`);
    });

    // Log the routes shown.
    test("log routes shown on page", async ({ page }) => {
      await test.step("Count available routes", async () => {
        const routes = await page.$$eval(
          "#route-form-container select#edit-routes option",
          (options) => options.map((option) => option.textContent)
        );

        const routeList = routes
          .filter(Boolean)
          .map((r) => r?.trim())
          .join("\n");
        logNote(`Routes listed:\n${routeList}`);
      });
    });
  });
});
