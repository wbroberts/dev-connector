const expect = require('expect');
const request = require('supertest');

const app = require('../../app');
const Profile = require('../../models/Profile');
const { profiles, populateProfiles } = require('../seed-data/seed-profiles');
const { users } = require('../seed-data/seed-users');

const authenticatedUser1 = request.agent(app);
const authenticatedUser2 = request.agent(app);
let token1;
let token2;

before(populateProfiles);

describe('GET /api/profile', () => {
  before('Authenticate user', done => {
    authenticatedUser1
      .post('/api/users/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .end((error, res) => {
        token1 = res.body.token;
        done();
      });
  });

  describe('Get profile SUCCESS', () => {
    it('should return a profile', done => {
      authenticatedUser1
        .get('/api/profile')
        .set('authorization', token1)
        .expect(200)
        .expect(res => {
          expect(res.body.profile).toBeDefined();
          expect(res.body.profile.user).toBe(users[0]._id.toString());
        })
        .end(done);
    });
  });

  describe('Get profile FAILURE', () => {
    it('should NOT return a profile', done => {
      authenticatedUser1
        .get('/api/profile')
        .set('authorization', token1 + 1)
        .expect(401)
        .end(done);
    });
  });
});

describe('POST /api/profile', () => {
  before('Authenticate user3 (no profile exists)', done => {
    authenticatedUser2
      .post('/api/users/login')
      .send({
        email: users[2].email,
        password: users[2].password
      })
      .end((error, res) => {
        token2 = res.body.token;
        done();
      });
  });

  afterEach('Remove new profile', done => {
    Profile.findOneAndRemove({ user: users[2]._id }).then(() => {
      done();
    });
  });

  describe('Create profile SUCCESS', () => {
    it('should create a profile', done => {
      const profileData = {
        user: users[2]._id,
        handle: 'user-3',
        status: 'Employed',
        skills: 'eating, food',
        bio: 'Just a bio'
      };

      authenticatedUser2
        .post('/api/profile')
        .set('authorization', token2)
        .send(profileData)
        .expect(201)
        .expect(res => {
          expect(res.body.profile).toBeDefined();
        })
        .end(() => {
          Profile.find({}).then(profiles => {
            expect(profiles.length).toBe(3);
            expect(profiles[2].skills.length).toBe(2);
            expect(profiles[2].handle).toBe(profileData.handle);
            done();
          });
        });
    });
  });

  describe('Create profile FAILURE', () => {
    it('should return HANDLE error', done => {
      const profileData = {
        user: users[2]._id,
        handle: '',
        status: 'Employed',
        skills: 'eating, food',
        bio: 'Just a bio'
      };

      authenticatedUser2
        .post('/api/profile')
        .set('authorization', token2)
        .send(profileData)
        .expect(400)
        .expect(res => {
          expect(res.body.errors.handle).toBeDefined();
        })
        .end(() => {
          Profile.find({}).then(profiles => {
            expect(profiles.length).toBe(2);
            done();
          });
        });
    });

    it('should return HANDLE (in use) error', done => {
      const profileData = {
        user: users[2]._id,
        handle: profiles[0].handle,
        status: 'Employed',
        skills: 'eating, food',
        bio: 'Just a bio'
      };

      authenticatedUser2
        .post('/api/profile')
        .set('authorization', token2)
        .send(profileData)
        .expect(400)
        .expect(res => {
          expect(res.body.errors.handle).toBeDefined();
        })
        .end(() => {
          Profile.find({}).then(profiles => {
            expect(profiles.length).toBe(2);
            done();
          });
        });
    });

    it('should return PROFILE (already exists) error', done => {
      const profileData = {
        user: users[0]._id,
        handle: 'handle',
        status: 'Employed',
        skills: 'eating, food',
        bio: 'Just a bio'
      };

      authenticatedUser1
        .post('/api/profile')
        .set('authorization', token1)
        .send(profileData)
        .expect(400)
        .expect(res => {
          expect(res.body.errors.profile).toBeDefined();
        })
        .end(() => {
          Profile.find({}).then(profiles => {
            expect(profiles.length).toBe(2);
            done();
          });
        });
    });
  });
});

describe('PUT /api/profile', () => {
  describe('Update profile SUCCESS', () => {
    it('should update the profile', done => {
      const profileUpdate = {
        user: users[1]._id,
        handle: 'updated-handle',
        status: 'new status',
        skills: 'sleeping, eating, drinking',
        bio: 'Just an updated bio',
        social: {
          instagram: 'instagram.com'
        }
      };

      authenticatedUser1
        .put('/api/profile')
        .set('authorization', token1)
        .send(profileUpdate)
        .expect(200)
        .expect(res => {
          expect(res.body.updatedProfile).toBeDefined();
        })
        .end(() => {
          Profile.find({}).then(profiles => {
            expect(profiles[1].status).toBe(profileUpdate.status);
            expect(profiles[1].handle).toBe(profileUpdate.handle);
            expect(profiles[1].social.instagram).toBeDefined();
            done();
          });
        });
    });
  });

  describe('Update profile FAILURE', () => {});
});
