import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://reqres.in',
    env: {
      jsonplaceholderUrl: 'https://jsonplaceholder.typicode.com',
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
    },
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(_on, config) {
      return config;
    },
  },
});
