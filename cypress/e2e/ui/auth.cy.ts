import { LoginPage } from '../../support/pages/LoginPage';

describe('Auth flows — Reqres.in', () => {
  context('Login', () => {
    it('stores a token in Cypress.env on successful login', () => {
      cy.fixture('ui/user').then((user: { email: string; password: string }) => {
        cy.login(user.email, user.password);
      });
      cy.wrap(null).then(() => {
        const token = Cypress.env('token') as string;
        expect(token).to.be.a('string').and.have.length.greaterThan(0);
      });
    });

    it('returns 400 and an error message when password is missing', () => {
      LoginPage.loginExpectingError({ email: 'eve.holt@reqres.in' }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Missing password');
      });
    });
  });

  context('Register', () => {
    it('returns a token on successful registration', () => {
      LoginPage.register({ email: 'eve.holt@reqres.in', password: 'pistol' }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token').that.is.a('string');
        expect(response.body).to.have.property('id').that.is.a('number');
      });
    });
  });
});
