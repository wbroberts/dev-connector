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
  addEducationToProfile
} = require('./helpers/profile-helpers');

router.get('/test', (req, res) => {
  res.json({
    message: 'This is from the profile route'
  });
});

// Authentication routes
// Private
router.all(
  ['/', '/experience', '/education'],
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

// DESC     Adds experience to user's profile
// METHODS  POST, DELETE
// ACCESS   Private
router.route('/experience').post(addExperienceToProfile);
router.route('/education').post(addEducationToProfile);

module.exports = router;
