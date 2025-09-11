import { expect, Page } from '@playwright/test';

export async function routeDownloadLink(page: Page) {
  // Navigate to the page (adjust as needed)
  await page.goto('/plan-your-trip/routes/41');

  // Locate the download button
  const downloadLink = page.locator('#download-link');
  await expect(downloadLink).toBeVisible();
  await expect(downloadLink).toContainText('Download Schedule');

  // Clicking it should open a new tab
  const [pdfPage] = await Promise.all([
    page.waitForEvent('popup'), // wait for the new tab
    downloadLink.click(), // click the button
  ]);

  // Ensure the new tab is actually a PDF
  await expect(pdfPage).toHaveURL(/\.pdf$/i);

  // Optionally check content type headers (if server sends them)
  const response = await pdfPage.waitForResponse((resp) => resp.url().match(/\.pdf$/i) !== null);
  expect(response.headers()['content-type']).toContain('pdf');
}
