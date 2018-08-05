const { ObjectID } = require('mongodb');

// Load profile models
const Profile = require('../../../models/Profile');

// Load functions
const profileFields = require('./functions/profileFields');
const profileValidation = require('../../../validation/profileValidation');
const experienceValidation = require('../../../validation/experienceValidation');
const educationValidation = require('../../../validation/educationValidation');

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

// Searches for the profile by handle
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

// Searches for profile by user ID
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

// Returns all profiles
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

// Adds experience to profile
const addExperienceToProfile = (req, res) => {
  const { errors, isValid } = experienceValidation(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'No profile found';
        throw Error();
      }

      // Add experience to the start of the array
      profile.experience.unshift(req.body);
      return profile;
    })
    .then(profile => profile.save())
    .then(profile => {
      res.status(200).json({ profile });
    })
    .catch(() => {
      res.status(400).json({ errors });
    });
};

const removeExperienceFromProfile = (req, res) => {
  const errors = {};
  const experienceId = req.params.expId;

  if (!ObjectID.isValid(experienceId)) {
    errors.experienceId = 'Not a valid object ID';
    return res.status(400).json({ errors });
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'No profile found';
        throw Error();
      }

      return profile;
    })
    .then(profile => {
      const experienceIndex = profile.experience
        .map(exp => exp.id)
        .indexOf(experienceId);

      if (experienceIndex === -1) {
        errors.experience = 'No experience found';
        throw Error();
      }

      profile.experience.splice(experienceIndex, 1);
      return profile.save();
    })
    .then(profile => {
      res.status(200).json({ profile });
    })
    .catch(() => {
      res.status(404).json({ errors });
    });
};

const addEducationToProfile = (req, res) => {
  const { errors, isValid } = educationValidation(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'No profile found';
        throw Error();
      }

      // Add experience to the start of the array
      profile.education.unshift(req.body);
      return profile;
    })
    .then(profile => profile.save())
    .then(profile => {
      res.status(200).json({ profile });
    })
    .catch(() => {
      res.status(400).json({ errors });
    });
};

const removeEducationFromProfile = (req, res) => {};

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getProfileByHandle,
  getProfileByUserId,
  getAllProfiles,
  addExperienceToProfile,
  removeExperienceFromProfile,
  addEducationToProfile
};
