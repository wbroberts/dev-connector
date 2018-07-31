const { ObjectID } = require('mongodb');

const User = require('../../../models/User');

const users = [
  {
    _id: new ObjectID(),
    name: 'User 1',
    email: 'user1@email.com',
    password: 'user1Password',
    password2: 'user1Password'
  },
  {
    _id: new ObjectID(),
    name: 'User 2',
    email: 'user2@email.com',
    password: 'user2Password',
    password2: 'user2Password'
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      return new User(users[0]).save();
    })
    .then(() => {
      return new User(users[1]).save();
    })
    .then(() => done());
};

module.exports = {
  users,
  populateUsers
};
