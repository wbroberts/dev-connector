const router = require('express').Router();
const passport = require('passport');

const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getProfileByHandle,
  getProfileByUserId,
  getAllProfiles,
  addExperience,
  addEducation,
  removeExperienceById,
  removeEducationById
} = require('./helpers/profile-helpers');

router.get('/test', (req, res) => {
  res.json({
    message: 'This is from the profile route'
  });
});

// Authentication routes
// Private
router.all(
  ['/', '/experience', '/experience/:expId', '/education', '/education/:eduId'],
  passport.authenticate('jwt', { session: false })
);

// ROUTE    /api/profile
// DESC     User profile routes (authenticated)
// METHODS  GET, POST, PUT
// ACCESS   Private
router
  .route('/')
  .get(getUserProfile)
  .post(createUserProfile)
  .put(updateUserProfile);

// ROUTE    /api/profile/experience(/:expId)
// DESC     Adds and removes experience from profile
// METHODS  POST, DELETE
// ACCESS   Private
router.route('/experience').post(addExperience);
router.route('/experience/:expId').delete(removeExperienceById);

// ROUTE    /api/profile/education(/:eduId)
// DESC     Adds and removes education from profile
// METHODS  POST, DELETE
// ACCESS   Private
router.route('/education').post(addEducation);
router.route('/education/:eduId').delete(removeEducationById);

// DESC     Ways to find/get a profile(s)
// METHODS  GET
// ACCESS   Public
router.route('/handle/:handle').get(getProfileByHandle); // by handle
router.route('/user/:id').get(getProfileByUserId); // by user id
router.route('/all').get(getAllProfiles); // all profiles

module.exports = router;
