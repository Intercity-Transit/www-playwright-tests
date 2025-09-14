import { test, expect } from '../../global-setup';
import { logNote } from '../utils/logNote';

test.describe('Hook Test', () => {
  test.beforeEach(async ({ page }) => {
    logNote('Starting hook test');
    await page.goto('/');
  });

  test('simple test to verify hooks', async ({ page }) => {
    await expect(page).toHaveTitle(/Intercity/);
  });
});
