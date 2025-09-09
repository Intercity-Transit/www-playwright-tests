import { test, expect, Page, Locator } from "../../global-setup";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";

// Helper function to locate the times table.
async function getTable(page: Page): Promise<Locator> {
  await page.waitForSelector("#route-table table tr", {
    state: "attached",
    timeout: 15000,
  });

  return page.locator("#route-table table").last();
}

test.describe("Route 41 page tests @routes", () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto("/plan-your-trip/routes/41");
    await common.closeSubscribePopup(page);
  });

  test("Route 41 schedule validation", async ({ page }) => {
    const timesTable = await getTable(page);

    // Verify time formats are present
    await expect.soft(timesTable, "Schedule should contain AM times").toContainText(/(a\.m\.?|am)/i);
    await expect.soft(timesTable, "Schedule should contain PM times").toContainText(/(p\.m\.?|pm)/i);

    // Verify key stops are included
    await expect.soft(timesTable, "Schedule should include Olympia Transit Center stop").toContainText("Olympia Transit Center");
    await expect.soft(timesTable, "Schedule should include Evergreen Dorms stop").toContainText("Evergreen Dorms");

    // Verify specific times are present
    await expect.soft(timesTable, "Schedule should include 6:00 time").toContainText("6:00");
    await expect.soft(timesTable, "Schedule should include 9:55 time").toContainText("9:55");
  });
});
