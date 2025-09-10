import { expect, Page } from '@playwright/test';

export async function assertFooterHasCustomerService(page: Page) {
  const footer = page.locator('footer');
  await expect(footer).toContainText('Customer Service');
  await expect(footer).toContainText('360-786-1881');
}

export async function assertFooterHasContactFormLink(page: Page) {
  const contactFormLink = page.locator('a:has-text("Contact Form")');
  await expect(contactFormLink).toBeVisible();
  await expect(contactFormLink).toHaveAttribute('href');
}
