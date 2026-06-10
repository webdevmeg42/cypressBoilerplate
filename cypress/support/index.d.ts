/// <reference types="cypress" />

declare module '@cypress/grep/src/support';
declare module '@cypress/grep/src/plugin' {
  function plugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void;
  export = plugin;
}

declare namespace Cypress {
  interface TestConfigOverrides {
    tags?: string | string[];
  }

  interface SuiteConfigOverrides {
    tags?: string | string[];
  }

  interface Chainable {
    /**
     * Log in via DummyJSON /auth/login. Stores accessToken in Cypress.env('token').
     * @example cy.login('emilys', 'emilyspass')
     */
    login(username: string, password: string): Chainable<string>;

    /**
     * Create a post via JSONPlaceholder /posts.
     * @example cy.createPost({ title: 'Hello', body: 'World', userId: 1 })
     */
    createPost(body: {
      title: string;
      body: string;
      userId: number;
    }): Chainable<Response<{ id?: number; title: string; body: string; userId: number }>>;
  }
}
