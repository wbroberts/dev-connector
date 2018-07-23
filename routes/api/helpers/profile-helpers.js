// Load Models
const Profile = require('../../../models/Profile');
const User = require('../../../models/User');

// Load functions
const profileFields = require('./functions/profileFields');

// GET '/api/profile'
const getUserProfile = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'No profile for this user';
        return res.status(401).json(errors);
      }
      res.status(200).json({ profile });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

// POST '/api/profile'
const createUserProfile = (req, res) => {
  const profileData = profileFields(req.user, req.body);

  const newProfile = new Profile(profileData);

  newProfile
    .save()
    .then(profile => {
      res.json({ profile });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

module.exports = {
  getUserProfile,
  createUserProfile
};
