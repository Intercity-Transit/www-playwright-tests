import { test, expect } from "../../global-setup";
import { logNote } from "../utils/logNote";
import * as common from "../assertions/common";
import * as footer from "../assertions/footer";

test.describe.serial(`Test landing page routes list @routes`, () => {
  let routeLinks: Array<{ text: string; href: string }> = [];

  // Go to routes page and get links list.
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/plan-your-trip/routes");
    await common.closeSubscribePopup(page);

    routeLinks = await page.$$eval("ul.routes-container > li a", (links) =>
      links.map((link) => ({
        text: link.textContent?.trim() || "unnamed",
        href: link.getAttribute("href") || "",
      }))
    );

    await page.close();
    logNote(`Found ${routeLinks.length} route links to test`);
  });

  // Test each routes link.
  test("check each link to a route page", async ({ page }) => {
    const failures: string[] = [];

    for (const routeLink of routeLinks) {
      await test.step(`click on route ${routeLink.text} (${routeLink.href})`, async () => {
        try {
          await page.goto(routeLink.href);

          const finalUrl = page.url();
          const error404 = await page.locator("text=404").count();
          const errorMsg = await page.locator("text=error").count();
          const pageTitle = (await page.title()).trim();
          const wasRedirect = finalUrl !== routeLink.href;

          if (
            error404 > 0 ||
            errorMsg > 0 ||
            !pageTitle ||
            finalUrl.includes("chrome-error://") ||
            wasRedirect
          ) {
            failures.push(
              `Route ${routeLink.text} (${routeLink.href}) failed. Final URL: ${finalUrl}`
            );
          }
        } catch (err) {
          failures.push(
            `Navigation error for ${routeLink.text} (${routeLink.href}): ${err}`
          );
        }
      });
    }

    // Fail the test at the end if any routes had problems
    if (failures.length > 0) {
      throw new Error(`Some route links failed:\n${failures.join("\n")}`);
    }
  });
});
