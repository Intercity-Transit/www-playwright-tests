

## Local setup


```bash
# 1. Install Node.js if not already (Ubuntu)
sudo apt update
sudo apt install -y nodejs npm

# 2. Create project folder
mkdir intercity-tests && cd intercity-tests
npm init -y

# 3. Install Playwright
npm i -D @playwright/test
npx playwright install

# 4. Install test specific tools
npx playwright install-deps

npx playwright install chromium
```


## Run and report

```bash
# Set your node version
nvm use

# Run all tests
npx playwright test

# Run a single test
npx playwright test src/tests/homepage-bus-routes --reporter=list

# Run test on specific environment
BASE_URL=https://test-intercity-transit.pantheonsite.io/ npx playwright test

# Run tests tagged "routes"
npx npx playwright test --grep @routes

# Open report
npx playwright show-report

```


## Debug a report
```bash
#Run with inspector and watch for modal:

npx playwright test src/tests/route-page --headed --debug
```
