const expect = require('expect');
const request = require('supertest');

const app = require('../../app');
const User = require('../../models/User');
const { users, populateUsers } = require('./seed-users/seed-users');

// Clears database and enters in two users
beforeEach(populateUsers);

// User registration
describe('POST /api/users/register', () => {
  describe('Register SUCCESS', () => {
    // Successfully register a user
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

  describe('Register FAILURE', () => {
    it('should return multpile errors', done => {
      const user = {
        name: 'w',
        email: 'fake',
        password: '123',
        password2: '123'
      };

      request(app)
        .post('/api/users/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(Object.keys(res.body.errors).length).toBe(3);
          expect(res.body.errors.name).toBeDefined();
          expect(res.body.errors.email).toBeDefined();
          expect(res.body.errors.password).toBeDefined();
        })
        .end(done);
    });

    it('should return EMAIL error', done => {
      const user = {
        name: 'fake user',
        email: 'fake@email',
        password: '123456',
        password2: '123456'
      };

      request(app)
        .post('/api/users/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(Object.keys(res.body.errors).length).toBe(1);
          expect(res.body.errors.email).toBeDefined();
        })
        .end(done);
    });

    it('should return PASSWORD error', done => {
      const user = {
        name: 'fake user',
        email: 'fake@email.com',
        password: '1234',
        password2: '1234'
      };

      request(app)
        .post('/api/users/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(Object.keys(res.body.errors).length).toBe(1);
          expect(res.body.errors.password).toBeDefined();
        })
        .end(done);
    });

    it('should return PASSWORDS (not matching) error', done => {
      const user = {
        name: 'fake user',
        email: 'fake@email.com',
        password: '123456',
        password2: '12347684'
      };

      request(app)
        .post('/api/users/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(Object.keys(res.body.errors).length).toBe(1);
          expect(res.body.errors.passwords).toBeDefined();
        })
        .end(done);
    });
  });
});

// User login
describe('POST /api/users/login', () => {
  describe('Login SUCCESS', () => {
    it('should log in the user', done => {
      const loginCredentials = {
        email: users[0].email,
        password: users[0].password
      };

      request(app)
        .post('/api/users/login')
        .send(loginCredentials)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
        })
        .end(done);
    });
  });

  describe('Login FAILURE', () => {
    // Wrong password
    it('should return PASSWORD error', done => {
      const loginCredentials = {
        email: users[0].email,
        password: users[1].password
      };

      request(app)
        .post('/api/users/login')
        .send(loginCredentials)
        .expect(404)
        .expect(res => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors.password).toBeDefined();
        })
        .end(done);
    });

    // Email not found
    it('should return EMAIL error', done => {
      const loginCredentials = {
        email: 'notAUser@fake.com',
        password: 'password'
      };

      request(app)
        .post('/api/users/login')
        .send(loginCredentials)
        .expect(404)
        .expect(res => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors.email).toBeDefined();
        })
        .end(done);
    });
  });
});
