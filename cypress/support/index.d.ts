/// <reference types="cypress" />

declare module '@cypress/grep' {
  export function register(): void;
}
declare module '@cypress/grep/plugin' {
  export function plugin(config: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions;
}

declare namespace Cypress {
  interface TestConfigOverrides {
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
