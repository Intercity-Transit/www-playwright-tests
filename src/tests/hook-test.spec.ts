import { test, expect } from "../../global-setup";

test.describe("Hook Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("simple test to verify hooks", async ({ page }) => {
    await expect(page).toHaveTitle(/Intercity/);
  });
});
