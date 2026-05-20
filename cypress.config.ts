import { defineConfig } from 'cypress';
import { randomUUID } from 'crypto';

import cypressGrep from '@cypress/grep/plugin';

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

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-software-rasterizer');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
        }
        return launchOptions;
      });

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
