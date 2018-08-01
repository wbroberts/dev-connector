const { ObjectID } = require('mongodb');

const User = require('../../models/User');

const user1ID = new ObjectID();
const user2ID = new ObjectID();
const user3ID = new ObjectID();

const users = [
  {
    _id: user1ID,
    name: 'User 1',
    email: 'user1@email.com',
    password: 'user1Password',
    password2: 'user1Password'
  },
  {
    _id: user2ID,
    name: 'User 2',
    email: 'user2@email.com',
    password: 'user2Password',
    password2: 'user2Password'
  },
  {
    _id: user3ID,
    name: 'User 3',
    email: 'user3@email.com',
    password: 'user3Password',
    password2: 'user3Password'
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();
      const user3 = new User(users[2]).save();

      return Promise.all([user1, user2, user3]);
    })
    .then(() => done());
};

module.exports = {
  users,
  populateUsers
};
