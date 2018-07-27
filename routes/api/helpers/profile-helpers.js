// Load profile models
const Profile = require('../../../models/Profile');
// Load functions
const profileFields = require('./functions/profileFields');
const profileValidation = require('../../../validation/profileValidation');

// GET '/api/profile'
const getUserProfile = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'Could not find profile';
        return res.status(401).json(errors);
      }
      res.status(200).json({ profile });
    })
    .catch(error => {
      errors.error = error;
      res.status(400).json(errors);
    });
};

// POST '/api/profile'
const createUserProfile = (req, res) => {
  const profileData = profileFields(req.user, req.body);

  const { errors, isValid } = profileValidation(profileData);
  // Check req.body for errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newProfile = new Profile(profileData);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Update profile if it already exists
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileData },
          { new: true }
        ).then(updatedProfile => {
          return res.status(200).json({ updatedProfile });
        });
      }

      // Check if handle exists (returns an error if it does)
      Profile.checkIfHandleExists(profileData.handle)
        .then(() => {
          // Save the new profile if handle does not exist
          newProfile.save().then(profile => {
            res.status(201).json({ profile });
          });
        })
        .catch(error => {
          errors.error = error;
          res.status(400).json(errors);
        });
    })
    .catch(error => {
      errors.error = error;
      res.status(400).json(error);
    });
};

module.exports = {
  getUserProfile,
  createUserProfile
};
