import { getUser, getUsers } from '../../support/api/jsonplaceholder';

describe('Users API — JSONPlaceholder', () => {
  it('GET /users returns all 10 users with the correct shape', { tags: ['@smoke', '@regression'] }, () => {
    getUsers().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(10);

      const first = response.body[0];
      expect(first).to.include.all.keys('id', 'name', 'username', 'email');
      expect(first.id).to.be.a('number');
      expect(first.email).to.be.a('string').and.include('@');
    });
  });

  it('GET /users/2 returns the correct user with a valid email', { tags: '@regression' }, () => {
    getUser(2).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(2);
      expect(response.body.name).to.be.a('string').and.have.length.greaterThan(0);
      expect(response.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });
});
