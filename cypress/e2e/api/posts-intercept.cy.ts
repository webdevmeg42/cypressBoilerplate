// cy.intercept() captures browser-side fetch/XHR — not cy.request().
// We visit the JSONPlaceholder site to establish a real browser context, then
// make fetch calls using absolute URLs so the intercept pattern matches exactly
// what goes through the Cypress proxy.

describe('Posts — cy.intercept() examples', { tags: '@regression' }, () => {
  const url = (path: string) =>
    `${Cypress.env('jsonplaceholderUrl') as string}${path}`;

  beforeEach(() => {
    cy.visit('https://jsonplaceholder.typicode.com');
  });

  it('stubs GET /posts/1 and returns a fake payload', () => {
    cy.intercept('GET', url('/posts/1'), {
      statusCode: 200,
      body: { id: 1, title: 'Stubbed Title', body: 'This response never left the browser', userId: 999 },
    }).as('getPost');

    cy.window()
      .then((win) => win.fetch(url('/posts/1')).then((r) => r.json()))
      .then((data: { title: string; userId: number }) => {
        expect(data.title).to.eq('Stubbed Title');
        expect(data.userId).to.eq(999);
      });

    cy.wait('@getPost').its('response.statusCode').should('eq', 200);
  });

  it('spies on a real GET /posts/2 request and asserts on the live response', () => {
    cy.intercept('GET', url('/posts/2')).as('getPost');

    cy.window().then((win) => win.fetch(url('/posts/2')));

    cy.wait('@getPost').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body).to.have.property('id', 2);
      expect(interception.response?.body).to.have.property('title').that.is.a('string');
    });
  });

  it('modifies a live response on the fly with req.reply()', () => {
    cy.intercept('GET', url('/posts/3'), (req) => {
      req.reply((res) => {
        res.body.title = 'Modified by Cypress';
      });
    }).as('modifiedPost');

    cy.window()
      .then((win) => win.fetch(url('/posts/3')).then((r) => r.json()))
      .then((data: { title: string }) => {
        expect(data.title).to.eq('Modified by Cypress');
      });

    cy.wait('@modifiedPost');
  });
});
