const { ObjectID } = require('mongodb');

const Profile = require('../../models/Profile');
const { users } = require('./seed-users');

const experienceID = new ObjectID();
const educationID = new ObjectID();

const profiles = [
  {
    user: users[0]._id,
    handle: 'user1',
    status: 'Fake',
    skills: 'None',
    bio: 'Just a bio',
    experience: [
      {
        _id: experienceID,
        title: 'Job',
        company: 'A Company Inc',
        location: 'Utah',
        from: 'May 2010',
        current: true
      }
    ],
    education: [
      {
        _id: educationID,
        school: 'University',
        degree: 'MS',
        fieldOfStudy: 'Biology',
        from: 'May 2017',
        current: true
      }
    ]
  },
  {
    user: users[1]._id,
    handle: 'user2',
    status: 'Fake Job',
    skills: 'None, another',
    bio: 'Just another bio'
  }
];

const populateProfiles = done => {
  Profile.remove({})
    .then(() => {
      const profile1 = new Profile(profiles[0]).save();
      const profile2 = new Profile(profiles[1]).save();

      return Promise.all([profile1, profile2]);
    })
    .then(() => done());
};

module.exports = {
  profiles,
  populateProfiles
};
