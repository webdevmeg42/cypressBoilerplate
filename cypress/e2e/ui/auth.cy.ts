import { LoginPage } from '../../support/pages/LoginPage';

describe('Auth flows — DummyJSON', () => {
  context('Login', () => {
    it('stores an accessToken in Cypress.env on successful login', () => {
      cy.fixture('ui/user').then((user: { username: string; password: string }) => {
        cy.login(user.username, user.password);
      });
      // cy.wrap(null) defers this assertion until cy.login() has completed
      // and Cypress.env('token') has been written by the command.
      cy.wrap(null).then(() => {
        const token = Cypress.env('token') as string;
        expect(token).to.be.a('string').and.have.length.greaterThan(0);
      });
    });

    it('returns 400 and an error message for invalid credentials', () => {
      LoginPage.loginExpectingError({ username: 'emilys', password: 'wrongpassword' }).then(
        (response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.be.a('string').and.have.length.greaterThan(0);
        }
      );
    });
  });

  context('Authenticated request', () => {
    it('GET /auth/me returns user data when called with a valid token', () => {
      cy.fixture('ui/user').then((user: { username: string; password: string }) => {
        cy.login(user.username, user.password);
      });
      // Defer until cy.login() has populated Cypress.env('token').
      cy.wrap(null).then(() => {
        const token = Cypress.env('token') as string;
        LoginPage.me(token).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id').that.is.a('number');
          expect(response.body).to.have.property('username').that.is.a('string');
          expect(response.body).to.have.property('email').that.is.a('string');
        });
      });
    });
  });
});
