import { test, expect, Page, Locator } from '../../global-setup';
import * as common from '../assertions/common';

test.describe('News and Alerts page tests', () => {
  test('validate news and alerts page functionality', async ({ page }) => {
    // Navigate to the page
    await page.goto('/about-us/news-and-alerts');
    await common.closeSubscribePopup(page);

    // Test page heading
    const h1 = page.locator('h1');
    await expect.soft(h1, 'Page should have correct heading').toContainText('News and Alerts');

    // Test article count
    const titles = page.locator('#block-views-block-news-block-2 h2');
    const count = await titles.count();
    expect.soft(count, 'Page should display at least 10 news articles').toBeGreaterThan(10);

    // Test article navigation
    const firstArticle = page.locator('#block-views-block-news-block-2 h2 a').first();
    const articleTitle = await firstArticle.textContent();
    await firstArticle.click();

    const detailH1 = page.locator('h1');
    await expect
      .soft(detailH1, 'Article detail page should display the correct article title')
      .toHaveText(articleTitle ?? '');
  });
});
