const expect = require('expect');
const request = require('supertest');

const app = require('../../app');
const User = require('../../models/User');
const populateUsers = require('./seed-users/seed-users');

// Clears database and enters in two users
beforeEach(populateUsers);

describe('Users', () => {
  // User registration
  describe('POST /api/users/register', () => {
    it('should register a user', done => {
      const user = {
        name: 'fake user',
        email: 'fake@fake.com',
        password: 'fakeaccount',
        password2: 'fakeaccount'
      };

      request(app)
        .post('/api/users/register')
        .send(user)
        .expect(201)
        .expect(res => {
          expect(typeof res).toBe('object');
        })
        .end(error => {
          if (error) done(error);

          User.find()
            .then(users => {
              expect(users.length).toBe(3);
              expect(users[2].email).toBe(user.email);
              done();
            })
            .catch(error => done(error));
        });
    });
  });

  // User login
  describe('POST /api/users/login', () => {});
});
