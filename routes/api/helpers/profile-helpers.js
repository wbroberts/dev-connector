// Load profile models
const Profile = require('../../../models/Profile');
// Load functions
const profileFields = require('./functions/profileFields');
const profileValidation = require('../../../validation/profileValidation');

// GET '/api/profile'
const getUserProfile = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      errors.profile = 'Profile not found';
      return res.status(401).json({ errors });
    }
    // Profile was found
    res.status(200).json({ profile });
  });
};

// POST '/api/profile'
const createUserProfile = (req, res) => {
  const profileData = profileFields(req.user, req.body);
  const { errors, isValid } = profileValidation(profileData);

  // Exit out early due to errors
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const newProfile = new Profile(profileData);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Error if the user has a profile
      if (profile) {
        errors.profile = 'Profile already exists';
        throw Error(errors);
      }
    })
    // See if the handle is available for the new profile
    .then(() => Profile.findOne({ handle: profileData.handle }))
    .then(handle => {
      // Error if handle is taken
      if (handle) {
        errors.handle = 'Handle not available';
        throw Error(errors);
      }
    })
    // Save the new profile--everything passed
    .then(() => newProfile.save())
    .then(profile => res.status.json({ profile }))
    .catch(() => res.status(400).json({ errors }));
};

const updateUserProfile = (req, res) => {
  const profileData = profileFields(req.user, req.body);
  const { errors, isValid } = profileValidation(profileData);

  // Exit out early due to errors
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  Profile.findOne({ handle: profileData.handle })
    .then(profile => {
      // Check to see if the handle is already in use and that it is not
      // the current user.
      if (profile && profile.user.toString() !== req.user.id.toString()) {
        errors.handle = 'Handle not available';
        throw Error(errors);
      }
    })
    // Update profile since handle did not change
    // or is available
    .then(() =>
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileData },
        { new: true }
      )
    )
    .then(updatedProfile => {
      // In case a PUT method is sent to update a non-existent profile
      if (updatedProfile === null) {
        errors.profile = 'Profile not found';
        throw Error(errors);
      }

      res.status(200).json({ updatedProfile });
    })
    .catch(() => res.status(400).json({ errors }));
};

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile
};
