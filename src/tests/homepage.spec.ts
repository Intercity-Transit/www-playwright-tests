import { test, expect } from "../../global-setup";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";

const pages = ["/"];

pages.forEach((slug) => {
  test.describe(`Tests for home page`, () => {
    // Navigate to the specific page before each test.
    test.beforeEach(async ({ page }) => {
      await page.goto(slug);
      await common.closeSubscribePopup(page);
    });

    // Test frequent tasks.
    test("page shows Frequent Tasks", async ({ page }) => {
      const heading = page.locator('h2:has-text("Frequent Tasks")');
      await expect(heading).toBeVisible();
    });

    // Test frequent tasks count.
    test("page shows at least 5 Frequent Tasks", async ({ page }) => {
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
  });
});
