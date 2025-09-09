import { test, expect, Page, Locator } from "../../global-setup";
import * as common from "../assertions/common";

test.describe("Schedule a Ride page tests", () => {
  test.beforeAll(async ({ page }) => {
    await page.goto("/dial-a-lift/schedule-a-ride");
    await common.closeSubscribePopup(page);
  });

  // Assert that h1 contains expected text.
  test("the h1 contains Scheduling a Ride", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect.soft(h1).toContainText("Scheduling a Ride");
  });

  // Check news items count.
  test("the page contains 360-754-9393", async ({ page }) => {
    const el = page.locator("text=360-754-9393");
    await expect.soft(el).toBeVisible();
  });

  test('the page contains "How to Ride Dial-A-Lift"', async ({ page }) => {
    const el = page.locator("text=How to Ride Dial-A-Lift");
    await expect.soft(el).toBeVisible();
  });

  test("the page contains a TTY message and 360-357-7133", async ({ page }) => {
    const el = page.locator(
      "text=for people with hearing or speaking difficulties"
    );
    await expect.soft(el).toBeVisible();
    const el2 = page.locator("text=360-357-7133");
    await expect.soft(el2).toBeVisible();
  });
});
