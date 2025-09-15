import { test } from '@playwright/test';

export function logNote(message: string) {
  try {
    // Add annotation to the Playwright report
    test.info().annotations.push({
      type: 'note',
      description: `✓ ${message}`,
    });
  } catch (error) {
    // If test.info() is not available, just log to console
    console.warn('Failed to add annotation:', error);
  }

  // Always print to console for debugging
  console.log(message);
}
