export interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

const baseUrl = (): string => Cypress.env('jsonplaceholderUrl') as string;

export const getPosts = (): Cypress.Chainable<Cypress.Response<Post[]>> =>
  cy.request<Post[]>(`${baseUrl()}/posts`);

export const getPost = (id: number): Cypress.Chainable<Cypress.Response<Post>> =>
  cy.request<Post>(`${baseUrl()}/posts/${id}`);

export const createPost = (body: Omit<Post, 'id'>): Cypress.Chainable<Cypress.Response<Post>> =>
  cy.request<Post>({
    method: 'POST',
    url: `${baseUrl()}/posts`,
    body,
  });

export const getUsers = (): Cypress.Chainable<Cypress.Response<User[]>> =>
  cy.request<User[]>(`${baseUrl()}/users`);

export const getUser = (id: number): Cypress.Chainable<Cypress.Response<User>> =>
  cy.request<User>(`${baseUrl()}/users/${id}`);
