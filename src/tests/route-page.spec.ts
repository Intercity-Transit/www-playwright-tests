import { test, expect, Page, Locator } from "@playwright/test";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";

const pages = ["/plan-your-trip/routes/41"];

// Helper function to locate the times table.
async function getTable(page: Page): Promise<Locator> {
  await page.waitForSelector("#route-table table tr", {
    state: "attached",
    timeout: 15000,
  });

  return page.locator("#route-table table").last();
}

pages.forEach((slug) => {
  test.describe(`Tests for ${slug} and route times (@routes)`, () => {
    // Test to match in tests.
    let string = "";

    // Navigate to the specific page before each test.
    test.beforeEach(async ({ page }) => {
      await page.goto(slug);
      await common.closeSubscribePopup(page);
    });

    // Test title.
    test("Route has times (@routes)", async ({ page }) => {
      const timesTable = await getTable(page);
      await expect.soft(timesTable).toContainText(/(a\.m\.?|am)/i);
      await expect.soft(timesTable).toContainText(/(p\.m\.?|pm)/i);
    });

    // Schedule tests.
    string = "Olympia Transit Center";
    test(`Route includes ${string}`, async ({ page }) => {
      const timesTable = await getTable(page);
      await expect.soft(timesTable).toContainText(string);
    });

    string = "Evergreen Dorms";
    test(`Route includes ${string}`, async ({ page }) => {
      const timesTable = await getTable(page);
      await expect.soft(timesTable).toContainText(string);
    });

    string = "6:00";
    test(`Route includes ${string}`, async ({ page }) => {
      const timesTable = await getTable(page);
      await expect.soft(timesTable).toContainText(string);
    });

    string = "9:55";
    test(`Route includes ${string}`, async ({ page }) => {
      const timesTable = await getTable(page);
      await expect.soft(timesTable).toContainText(string);
    });
  });
});
