// Load Models
const Profile = require('../../../models/Profile');
const User = require('../../../models/User');

// GET '/api/profile'
exports.getUserProfile = (req, res) => {
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

// POST '/api/profile/'
exports.createUserProfile = (req, res) => {
  const profileFields = {};

  profileFields.user = req.user.id;
  profileFields.handle = req.body.handle;
  profileFields.status = req.body.status;

  if (req.body.skills) profileFields.skills = req.body.skills.split(',');

  const newProfile = new Profile(profileFields);

  newProfile
    .save()
    .then(profile => {
      res.json({ profile });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

module.exports = exports;
