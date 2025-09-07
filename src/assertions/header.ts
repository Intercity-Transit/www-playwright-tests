import { expect, Page } from "@playwright/test";

export async function assertHeaderHasSearchForm(page: Page) {
  const searchInput = page.locator('.region-header-top form input[type="search"]');
  await expect(searchInput).toBeVisible();
}
