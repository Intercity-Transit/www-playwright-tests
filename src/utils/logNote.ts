import { test } from '@playwright/test';

export function logNote(message: string) {
  // Add annotation to the Playwright report
  test.info().annotations.push({
    type: 'note',
    description: message,
  });

  // Print to console
  console.log(message);
}
