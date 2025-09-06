# Intercity Transit Tests

Playwright test suite for the Intercity Transit website.

For detailed Playwright documentation, see https://playwright.dev/.

Playwright is a testing framework to automate end-to-end browser test for websites. It's used in the termal, runs tests a headless (or headed) browser, and generates detailed reports of the results.

## Setup

### Prerequisites
```bash
# Install Node.js (Ubuntu)
sudo apt update
sudo apt install -y nodejs npm
# Install npx (if not already installed)
sudo npm install -g npx
# Set your Node version
nvm use
```

### Install Dependencies
```bash
# Install Playwright
npm i

# Install browsers and dependencies
npx playwright install
npx playwright install-deps
npx playwright install chromium
```

## Running Tests

### Local Development Server
```bash
# Run all tests against your local dev server
npx playwright test

# Run a specific test
npx playwright test src/tests/homepage-bus-routes --reporter=list

# Run tests with a specific tag
npx playwright test --grep @routes
```

### Intercity Transit WWW Site
```bash
# Run tests against the live site
BASE_URL=https://test-intercity-transit.pantheonsite.io/ npx playwright test

# Run specific test against live site
BASE_URL=https://test-intercity-transit.pantheonsite.io/ npx playwright test src/tests/homepage-bus-routes
```

### View Results
```bash
# Open test report
npx playwright show-report
```

## Debugging

```bash
# Run with browser UI and debugger
npx playwright test src/tests/route-page --headed --debug
```
