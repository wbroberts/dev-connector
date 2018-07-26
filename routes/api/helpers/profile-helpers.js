// Load profile models
const Profile = require('../../../models/Profile');
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

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Update profile if it already exists
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileData },
          { new: true }
        ).then(updated => {
          res.status(200).json({ updated });
        });
      } else {
        // Check if handle exists (returns an error if it does)
        Profile.checkIfHandleExists(profileData.handle)
          .then(() => {
            // Save the new profile if handle does not exist
            newProfile.save().then(profile => {
              res.status(201).json({ profile });
            });
          })
          .catch(error => {
            res.status(400).json({ error });
          });
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

module.exports = {
  getUserProfile,
  createUserProfile
};
