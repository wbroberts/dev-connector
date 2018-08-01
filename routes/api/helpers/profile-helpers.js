const { ObjectID } = require('mongodb');

// Load profile models
const Profile = require('../../../models/Profile');

// Load functions
const profileFields = require('./functions/profileFields');
const profileValidation = require('../../../validation/profileValidation');

// GET '/api/profile'
// Returns the profile of the logged in user
const getUserProfile = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'Profile not found';
        return res.status(401).json({ errors });
      }
      // Profile was found
      res.status(200).json({ profile });
    });
};

// POST '/api/profile'
// Creates profile
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
        throw Error();
      }
    })
    // See if the handle is available for the new profile
    .then(() => Profile.findOne({ handle: profileData.handle }))
    .then(handle => {
      // Error if handle is taken
      if (handle) {
        errors.handle = 'Handle not available';
        throw Error();
      }
    })
    // Save the new profile--everything passed
    .then(() => newProfile.save())
    .then(profile => res.status(200).json({ profile }))
    .catch(() => res.status(400).json({ errors }));
};

// PUT '/api/profile'
// Updates the profile
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
        throw Error();
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
        errors.profile = 'No profile to update';
        throw Error();
      }

      res.status(200).json({ updatedProfile });
    })
    .catch(() => res.status(400).json({ errors }));
};

const getProfileByHandle = (req, res) => {
  const errors = {};
  const handle = req.params.handle;

  Profile.findOne({ handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.handle = 'No profile found';
        throw Error();
      }

      res.status(200).json({ profile });
    })
    .catch(() => {
      res.status(404).json({ errors });
    });
};

const getProfileByUserId = (req, res) => {
  const errors = {};
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    errors.notValid = 'Not a valid id';
    return res.status(400).json({ errors });
  }

  Profile.findOne({ user: id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'No profile found';
        throw Error();
      }

      res.status(200).json({ profile });
    })
    .catch(() => {
      res.status(404).json({ errors });
    });
};

const getAllProfiles = (req, res) => {
  const errors = {};

  Profile.find({})
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (profiles.length === 0) {
        errors.profiles = 'There are no profiles yet';
        throw Error();
      }

      res.status(200).json({ count: profiles.length, profiles });
    })
    .catch(() => res.status(404).json({ errors }));
};

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getProfileByHandle,
  getProfileByUserId,
  getAllProfiles
};
