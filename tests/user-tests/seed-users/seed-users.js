const { ObjectID } = require('mongodb');

const User = require('../../../models/User');

const users = [
  {
    _id: new ObjectID(),
    name: 'User 1',
    email: 'user1@email.com',
    password: 'password',
    password2: 'password'
  },
  {
    _id: new ObjectID(),
    name: 'User 2',
    email: 'user2@email.com',
    password: 'password',
    password2: 'password'
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

module.exports = populateUsers;
