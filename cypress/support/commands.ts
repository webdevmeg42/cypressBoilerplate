import { createPost } from './api/jsonplaceholder';
import { LoginPage } from './pages/LoginPage';

Cypress.Commands.add('login', (email: string, password: string) => {
  return LoginPage.login({ email, password }).then(({ body }) => {
    Cypress.env('token', body.token);
    return body.token;
  });
});

Cypress.Commands.add('createPost', (body) => {
  return createPost(body) as unknown as Cypress.Chainable<
    Cypress.Response<{ id: number; title: string; body: string; userId: number }>
  >;
});
