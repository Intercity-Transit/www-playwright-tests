import { test, expect } from "../../global-setup";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";
import { BUS_ROUTES } from "../utils/constants";

test.describe(`Tests for routes landing page @routes`, () => {
  // Navigate to the specific page before each test.
  test.beforeEach(async ({ page }) => {
    await page.goto("/plan-your-trip/routes");
    await common.closeSubscribePopup(page);
  });

  // Test title.
  let string = "Select a Bus Route";
  test(`page has a h2 with text "${string}"`, async ({ page }) => {
    const heading = page.locator(`h2:has-text("${string}")`);
    await expect(heading).toBeVisible();
  });

  // Test routes list.
  test("there's a routes list with over 18 items", async ({ page }) => {
    const items = await page.$$eval(
      "ul.routes-container > li",
      (elements) => elements.length
    );
    expect(items).toBeGreaterThanOrEqual(18);
  });

  // Test specific routes are present.
  test(`there's a link to each route ${BUS_ROUTES.join(", ")}`, async ({ page }) => {
    const missingRoutes: string[] = [];

    for (const route of BUS_ROUTES) {

      //<a class="route-link" href="/plan-your-trip/routes/12" tabindex="-1">
      const routeElement = page.locator(`ul.routes-container > li a[href="/plan-your-trip/routes/${route}"]`);

      const isVisible = await routeElement.isVisible();
      if (!isVisible) {
        logNote(`Missing route: "${route}"`);
        missingRoutes.push(route);
      } else {
        logNote(`Found route: "${route}"`);
      }
    }

    // Fail the test if any routes are missing
    if (missingRoutes.length > 0) {
      throw new Error(
        `Missing ${missingRoutes.length} route(s): ${missingRoutes.join(", ")}`
      );
    }
  });

  // Test map.
  test('can click "Show map" link and see a map', async ({ page }, testInfo) => {
    let screenshot = await page.screenshot();

    await testInfo.attach("before clicking screenshot", {
      body: screenshot,
      contentType: "image/png",
    });

    const showMapLink = page.locator('a:has-text("Show map")');
    await expect(showMapLink).toBeVisible();

    await showMapLink.click();

    // Wait for map to load and check for common map indicators
    await page.waitForLoadState("networkidle");

    // Look for common map elements (adjust selectors based on actual map implementation)
    const mapContainer = page
      .locator('[id*="map"], [class*="map"], canvas, iframe[src*="map"]')
      .first();
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    screenshot = await page.screenshot();

    await testInfo.attach("after clicking Show map screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
