import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  reporter: [
    ["list"],
    ["html", { outputFolder: "test-results", open: "never" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "https://www.intercitytransit.com",
    headless: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // 👇 Add this block
  hooks: {
    async beforeEach({ page }, testInfo) {
      // Override page.goto globally
      const originalGoto = page.goto.bind(page);
      page.goto = async (url: string, options?: any) => {
        const response = await originalGoto(url, options);
        const finalUrl = page.url();
        const message = `→ page.goto(${url}) → final: ${finalUrl}`;
        console.log(message);
        testInfo.annotations.push({ type: "note", description: message });
        return response;
      };
    },
  },
});
