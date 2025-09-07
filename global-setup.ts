import { test as base, expect } from "@playwright/test";

// Extend the base test to include global hooks
export const test = base.extend({});

// Add global beforeEach hook
test.beforeEach(async ({ page }, testInfo) => {
  // Override page.goto to log URLs
  const originalGoto = page.goto.bind(page);
  page.goto = async (url: string, options?: any) => {
    const response = await originalGoto(url, options);
    const finalUrl = page.url();
    const message = `→ page.goto(${url}) → final: ${finalUrl}`;
    testInfo.annotations.push({ type: "note", description: message });
    console.log(message);
    return response;
  };
});

// Add global afterEach hook
test.afterEach(async ({ page }, testInfo) => {
  // Take a screenshot after each test
  try {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("final-screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
    console.log(`Screenshot taken for test: ${testInfo.title}`);
  } catch (error) {
    console.log(`Failed to take screenshot: ${error}`);
  }
});

export { expect, Page, Locator } from "@playwright/test";
