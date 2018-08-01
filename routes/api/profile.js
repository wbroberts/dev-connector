const router = require('express').Router();
const passport = require('passport');

const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getProfileByHandle,
  getAllProfiles
} = require('./helpers/profile-helpers');

router.get('/test', (req, res) => {
  res.json({
    message: 'This is from the profile route'
  });
});

// ROUTE    /api/profile
// DESC     User profile routes (authenticated)
// METHODS  GET, POST, PUT
// ACCESS   Private
router.all('/', passport.authenticate('jwt', { session: false }));
router
  .route('/')
  .get(getUserProfile)
  .post(createUserProfile)
  .put(updateUserProfile);

// ROUTE    /api/profile/:handle
// DESC     Return a profile by user handle
// METHODS  GET
// ACCESS   Public
router.route('/handle/:handle').get(getProfileByHandle);

// ROUTE    /api/profile/all
// DESC     Returns all profiles
// METHODS  GET
// ACCESS   Public
router.route('/all').get(getAllProfiles);

module.exports = router;
