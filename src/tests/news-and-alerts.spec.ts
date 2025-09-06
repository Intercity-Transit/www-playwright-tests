import { test, expect } from "@playwright/test";
import { logNote } from '../utils/logNote';

const pages = ["/about-us/news-and-alerts"];

test.describe("News and Alerts Page Specific Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about-us/news-and-alerts");
  });

  test("has correct h1 and contains articles", async ({ page }) => {

    // Assert that h1 contains expected text
    const h1 = page.locator("h1");
    const text = await h1.textContent();

    await expect(h1).toContainText("News and Alerts");
    logNote(`H1 content found: "${text}"`);

    // Check news items count
    const titles = page.locator(
      "#block-views-block-news-block-2 div.views-field > h2"
    );

    const count = await titles.count();
    await expect.soft(titles).toHaveCount(20);
    logNote(`Number of news titles found: ${count}`);
  });
});
