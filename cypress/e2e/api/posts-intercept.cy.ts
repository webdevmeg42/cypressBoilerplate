// cy.intercept() captures browser-side fetch/XHR — not cy.request().
// Visiting the JSONPlaceholder page establishes a real same-origin context so
// window.fetch('/posts/1') routes through the Cypress proxy and gets intercepted
// without triggering Chrome's null-origin IPC rejection.

describe('Posts — cy.intercept() examples', { tags: '@regression' }, () => {
  beforeEach(() => {
    cy.visit('https://jsonplaceholder.typicode.com');
  });

  it('stubs GET /posts/1 and returns a fake payload', () => {
    cy.intercept('GET', '/posts/1', {
      id: 1,
      title: 'Stubbed Title',
      body: 'This response never left the browser',
      userId: 999,
    }).as('getPost');

    cy.window()
      .then((win) => win.fetch('/posts/1').then((r) => r.json()))
      .then((data: { title: string; userId: number }) => {
        expect(data.title).to.eq('Stubbed Title');
        expect(data.userId).to.eq(999);
      });

    cy.wait('@getPost').its('response.statusCode').should('eq', 200);
  });

  it('spies on a real GET /posts/2 request and asserts on the live response', () => {
    cy.intercept('GET', '/posts/2').as('getPost');

    cy.window().then((win) => win.fetch('/posts/2'));

    cy.wait('@getPost').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body).to.have.property('id', 2);
      expect(interception.response?.body).to.have.property('title').that.is.a('string');
    });
  });

  it('modifies a live response on the fly with req.reply()', () => {
    cy.intercept('GET', '/posts/3', (req) => {
      req.reply((res) => {
        res.body.title = 'Modified by Cypress';
      });
    }).as('modifiedPost');

    cy.window()
      .then((win) => win.fetch('/posts/3').then((r) => r.json()))
      .then((data: { title: string }) => {
        expect(data.title).to.eq('Modified by Cypress');
      });

    cy.wait('@modifiedPost');
  });
});
