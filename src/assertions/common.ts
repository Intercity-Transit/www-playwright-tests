import { expect, Page } from "@playwright/test";

export async function assertPageHasTitle(page: Page) {
  await expect(page).toHaveTitle(/Intercity Transit/i);
}

export async function closeSubscribePopup(page: Page) {
  // Press escape just in case
  await page.keyboard.press("Escape");

  const closeButton = page.locator("#prefix-overlay-header button");

  try {
    // Wait up to 5s for popup
    if (await closeButton.isVisible({ timeout: 5000 })) {
      await closeButton.click();
      // Wait until modal disappears
      await closeButton.waitFor({ state: "detached", timeout: 5000 });
    }
  } catch (e) {
    // No popup appeared — safe to ignore
  }
}
