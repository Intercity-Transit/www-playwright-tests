import { logNote } from './logNote';


/***
 * Fetch data from an API endpoint with retry logic.
 * @param request - Playwright request object
 * @param url - The API endpoint URL
 * @param maxRetries - Maximum number of retry attempts (default is 3)
 * @returns The JSON response from the API
 * @throws An error if all retry attempts fail
 */
export async function fetchApiWithRetry(request: any, url: string, maxRetries: number = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await request.get(url, { timeout: 10000 });

      if (response.ok()) {
        return await response.json();
      }

      throw new Error(`HTTP ${response.status()}`);
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      logNote(`API request attempt ${attempt}/${maxRetries} failed:`, error);

      if (isLastAttempt) {
        throw error;
      }

      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
