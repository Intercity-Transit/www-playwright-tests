import { test, expect, Page, Locator } from '../../global-setup';
import { logNote } from '../utils/logNote';
import * as common from '../assertions/common';

test.describe('Schedule a Ride page tests', () => {
  test.beforeEach(async ({ page }) => {
    logNote('Starting schedule a ride page test');
    await page.goto('/dial-a-lift/schedule-a-ride');
    await common.closeSubscribePopup(page);
  });

  test('validate schedule a ride page content', async ({ page }) => {
    // Test page heading
    const h1 = page.locator('h1');
    await expect.soft(h1, 'Page should have correct heading').toContainText('Scheduling a Ride');

    // Test main phone number is visible
    const phoneNumber = page.getByText('360-754-9393').first();
    await expect.soft(phoneNumber, 'Page should display the main phone number 360-754-9393').toBeVisible();

    // Test how to ride section
    const howToRideSection = page.getByText('How to Ride Dial-A-Lift').first();
    await expect.soft(howToRideSection, "Page should contain 'How to Ride Dial-A-Lift' section").toBeVisible();

    // Test TTY information
    const ttyMessage = page.getByText('for people with hearing or speaking difficulties').first();
    await expect.soft(ttyMessage, 'Page should display TTY accessibility message').toBeVisible();

    const ttyNumber = page.getByText('360-357-7133').first();
    await expect.soft(ttyNumber, 'Page should display the TTY phone number 360-357-7133').toBeVisible();
  });
});
