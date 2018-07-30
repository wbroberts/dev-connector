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
        errors.profile = 'Profile not found';
        return res.status(401).json(errors);
      }
      // Profile was found
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

  // Exit out early due to errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newProfile = new Profile(profileData);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // See if the user already has a profile
      if (profile) {
        errors.profile = 'Profile already exists';
        return res.status(400).json(errors);
      }

      return Profile.findOne({ handle: profileData.handle });
    })
    .then(handle => {
      // See if the handle the user wants is already taken
      if (handle) {
        errors.handle = 'Handle not available';
        return res.status(400).json(errors);
      }

      // Save the new profile--everything passed
      newProfile
        .save()
        .then(profile => {
          res.status(201).json(profile);
        })
        .catch(error => {
          errors.error = error;
          res.status(400).json(errors);
        });
    });
};

const updateUserProfile = (req, res) => {
  const profileData = profileFields(req.user, req.body);
  const { errors, isValid } = profileValidation(profileData);

  // Exit out early due to errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ handle: profileData.handle }).then(profile => {
    // Check to see if the handle is already in use and that it is not
    // the current user.
    if (profile && profile.user.toString() !== req.user.id.toString()) {
      errors.handle = 'Handle not available';
      return res.status(400).json(errors);
    }

    // Update the profile if
    Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true }
    ).then(updatedProfile => {
      res.status(200).json(updatedProfile);
    });
  });
};

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile
};
