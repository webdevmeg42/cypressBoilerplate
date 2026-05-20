import { defineConfig } from 'cypress';
import { randomUUID } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cypressGrep = require('@cypress/grep/src/plugin');

export default defineConfig({
  e2e: {
    baseUrl: 'https://dummyjson.com',
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
    retries: {
      runMode: 2,  // retry failing tests up to 2x in CI
      openMode: 0,
    },
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      cypressGrep(on, config);

      on('task', {
        generateUuid(): string {
          return randomUUID();
        },
        log(message: string): null {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },
});
