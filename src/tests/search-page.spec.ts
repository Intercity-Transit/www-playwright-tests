import { test, expect } from "../../global-setup";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as header from "../assertions/header";
import * as footer from "../assertions/footer";

test.describe(`Tests for search page @search`, () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await common.closeSubscribePopup(page);
  });

  // Test header search form.
  test("the header contains a search form", async ({ page }) => {
    await header.assertHeaderHasSearchForm(page);
  });

  // Test header form search.
  test("searching redirects to a results page", async ({
    page,
  }) => {
    const searchInput = page.locator('.region-header-top input[type="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("wheel");

    // Wait for navigation to complete after pressing Enter
    await Promise.all([page.waitForNavigation(), searchInput.press("Enter")]);
    await expect(page).toHaveURL(/search\/wheel/);
  });

  // Test results show and are clickable.
  test("search has results clickable", async ({ page }) => {
    // Navigate directly to search results page
    await page.goto("/search/wheel");
    await common.closeSubscribePopup(page);

    const results = page.locator("div.main-container h3 > a");
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
    logNote(`Number of search results found: ${count}`);

    // Test that we can click on a specific result
    const accessibilityLink = page.locator(
      'h3 > a[href="/bus/accessible-services"]'
    );
    await expect(accessibilityLink).toBeVisible();
    await accessibilityLink.click();
    await expect(page).toHaveURL(/bus\/accessible-services/);
  });
});
