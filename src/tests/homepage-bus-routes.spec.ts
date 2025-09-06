import { test, expect } from "@playwright/test";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";

const pages = ["/"];

pages.forEach((slug) => {
  test.describe(`Tests for home page routes information (@routes)`, () => {
    // Navigate to the specific page before each test.
    test.beforeEach(async ({ page }) => {
      await page.goto(slug);
    });

    // Test title.
    test(`page contains title`, async ({ page }) => {
      await common.assertPageHasTitle(page);
    });

    // Test phone shows.
    test("footer contains customer service number", async ({ page }) => {
      await footer.assertFooterHasCustomerService(page);
    });

    // Test frequent tasks.
    test("page shows Frequent Tasks", async ({ page }) => {
      const heading = page.locator('h2:has-text("Frequent Tasks")');
      await expect(heading).toBeVisible();
    });

    // Test frequent tasks count.
    test("there's at least 5 frequent tasks options", async ({ page }) => {
      const tasks = page.locator(
        "div.view-id-home_featured_tasks div.homeFeaturedLinks"
      );
      const count = await tasks.count();
      expect(count).toBeGreaterThanOrEqual(5);
      logNote(`Number of frequent tasks found: ${count}`);
    });

    // Test schedules link.
    test("there's a Bus Schedules link in main container", async ({ page }) => {
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
      expect(routes.length).toBeGreaterThanOrEqual(20);
      logNote(`Number of routes found: ${routes.length}`);
    });

    // Log number of routes.
    test("log routes shown on page", async ({ page }) => {
      await test.step("Count available routes", async () => {
        const routes = await page.$$eval(
          "#route-form-container select#edit-routes option",
          (options) => options.map((option) => option.textContent)
        );
        logNote(`Number of routes found: ${routes.length}`);

        const routeList = routes.filter(Boolean).map((r) => r?.trim()).join('\n');
        logNote(`Routes:\n${routeList}`);

      });
    });
  });
});
