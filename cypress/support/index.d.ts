/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Log in via Reqres.in /api/login. Stores token in Cypress.env('token').
     * @example cy.login('eve.holt@reqres.in', 'cityslicka')
     */
    login(email: string, password: string): Chainable<string>;

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
