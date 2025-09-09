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

test.describe("Tests for /plan-your-trip/routes/622 and route times @routes", () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto("/plan-your-trip/routes/622");
    await common.closeSubscribePopup(page);
  });

  test("Route 622 schedule validation @routes", async ({ page }) => {
    const timesTable = await getTable(page);

    await expect
      .soft(timesTable, "Route schedule should display AM departure times")
      .toContainText(/(a\.m\.?|am)/i);
    await expect
      .soft(timesTable, "Route schedule should display PM departure times")
      .toContainText(/(p\.m\.?|pm)/i);
    await expect
      .soft(timesTable, "Route should include Olympia Transit Center as a stop")
      .toContainText("Olympia Transit Center");
    await expect
      .soft(
        timesTable,
        "Route should include Pacific Ave at Rockcress Dr as a stop"
      )
      .toContainText("Pacific Ave at Rockcress Dr");
    await expect
      .soft(timesTable, "Route should include 7:00 a.m. departure time")
      .toContainText("7:00 a.m.");
    await expect
      .soft(timesTable, "Route should include 12:12 a.m. departure time")
      .toContainText("12:12 a.m.");
  });
});
