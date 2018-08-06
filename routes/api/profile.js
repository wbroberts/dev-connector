const router = require('express').Router();
const passport = require('passport');

const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getProfileByHandle,
  getProfileByUserId,
  getAllProfiles,
  addExperienceToProfile,
  addEducationToProfile,
  removeExperienceFromProfile,
  removeEducationFromProfile
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

// DESC     Ways to find/get a profile(s)
// METHODS  GET
// ACCESS   Public
router.route('/handle/:handle').get(getProfileByHandle); // by handle
router.route('/user/:id').get(getProfileByUserId); // by user id
router.route('/all').get(getAllProfiles); // all profiles

// DESC     Adds experience and education to user's profile
// METHODS  POST
// ACCESS   Private
router.route('/experience').post(addExperienceToProfile);
router.route('/education').post(addEducationToProfile);

// DESC     Removes experience and education from user's profile
// METHODS  DELETE
// ACCESS   Private
router.route('/experience/:expId').delete(removeExperienceFromProfile);
router.route('/education/:eduId').delete(removeEducationFromProfile);

module.exports = router;
