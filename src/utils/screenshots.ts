import { test, Page } from '../../global-setup';

/**
 * Takes a screenshot and attaches it to the test report
 * @param page - Playwright page object
 * @param name - Name/description for the screenshot attachment
 * @param options - Screenshot options (optional)
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options: { fullPage?: boolean } = {}
): Promise<void> {
  const screenshot = await page.screenshot(options);
  await test.info().attach(name, {
    body: screenshot,
    contentType: 'image/png',
  });
}
