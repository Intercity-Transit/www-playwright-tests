import { test, expect, Page, Locator } from '../../global-setup';
import { logNote } from '../utils/logNote';
import { takeScreenshot } from '../utils/screenshots';
import * as common from '../assertions/common';

test.describe('News and Alerts page tests', () => {
  test.beforeEach(async ({ page }) => {
    logNote('Starting news and alerts page test');
    await page.goto('/about-us/news-and-alerts');
    await common.closeSubscribePopup(page);
  });

  test('validate page functionality', async ({ page }) => {
    // Test page heading
    const h1 = page.locator('h1');
    await expect.soft(h1, 'Page should have correct heading').toContainText('News and Alerts');

    // Test article count
    const titles = page.locator('#block-views-block-news-block-2 h2');
    const count = await titles.count();
    expect.soft(count, 'Page should display at least 10 news articles').toBeGreaterThan(10);
    logNote(`✓ Found ${count} news articles on the page`);

    // Screenshot the list
    await takeScreenshot(page, 'news and alerts list', { fullPage: true });

    // Test article navigation
    const firstArticle = page.locator('#block-views-block-news-block-2 h2 a').first();
    const articleTitle = await firstArticle.textContent();
    await firstArticle.click();

    const detailH1 = page.locator('h1');
    await expect
      .soft(detailH1, 'Article page should display the correct article title')
      .toHaveText(articleTitle ?? '');
    logNote(`✓ Successfully navigated to article: ${articleTitle}`);

    // Screenshot the article
    await takeScreenshot(page, 'news and alerts article');
  });
});
