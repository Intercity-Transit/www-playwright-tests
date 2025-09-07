import { test, expect, Page, Locator } from "../../global-setup";
import * as common from "../assertions/common";

test.describe("News and Alerts page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about-us/news-and-alerts");
    await common.closeSubscribePopup(page);
  });

  // Assert that h1 contains expected text.
  test("the h1 contains News and Alerts", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toContainText("News and Alerts");
  });

  // Check news items count.
  test("the page lists 20 articles", async ({ page }) => {
    const titles = page.locator("#block-views-block-news-block-2 h2");
    const count = await titles.count();
    await expect.soft(titles).toHaveCount(20);
  });
});
