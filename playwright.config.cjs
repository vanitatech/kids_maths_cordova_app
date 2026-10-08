const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:8769/demos/kids-maths/',
    viewport: { width: 390, height: 844 },
  },
  webServer: {
    command: 'node tools/serve.mjs',
    url: 'http://127.0.0.1:8769/demos/kids-maths/',
    reuseExistingServer: false,
  },
});
