import { getUser, getUsers } from '../../support/api/jsonplaceholder';

type User = { id: number; name: string; username: string; email: string; phone: string; website: string };

describe('Users API — JSONPlaceholder', () => {
  it('GET /users returns all users with the correct shape', { tags: ['@smoke', '@regression'] }, () => {
    cy.fixture<User[]>('api/users').then((expected) => {
      getUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.greaterThan(0);

        const first = response.body[0];
        expect(first).to.include.all.keys(Object.keys(expected[0]));
        expect(first.id).to.be.a('number');
        expect(first.email).to.be.a('string').and.include('@');
      });
    });
  });

  it('GET /users/2 returns the correct user with a valid email', { tags: '@regression' }, () => {
    cy.fixture<User>('api/user').then((expected) => {
      getUser(2).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(expected.id);
        expect(response.body.name).to.be.a('string').and.have.length.greaterThan(0);
        expect(response.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });
});
