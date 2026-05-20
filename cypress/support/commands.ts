import { createPost, Post } from './api/jsonplaceholder';
import { LoginPage } from './pages/LoginPage';

Cypress.Commands.add('login', (username: string, password: string) => {
  return LoginPage.login({ username, password }).then(({ body }) => {
    Cypress.env('token', body.accessToken);
    return body.accessToken;
  });
});

Cypress.Commands.add('createPost', (body: Omit<Post, 'id'>) => {
  return createPost(body);
});
