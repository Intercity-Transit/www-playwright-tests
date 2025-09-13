import { test } from '@playwright/test';

export function logNote(message: string) {
  const timestamp = new Date().toISOString();
  const timestampedMessage = `[${timestamp}] ${message}`;

  try {
    // Add annotation to the Playwright report
    test.info().annotations.push({
      type: 'note',
      description: timestampedMessage,
    });
  } catch (error) {
    // If test.info() is not available, just log to console
    console.warn('Failed to add annotation:', error);
  }

  // Always print to console for debugging
  console.log(timestampedMessage);
}
