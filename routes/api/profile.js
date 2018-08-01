const router = require('express').Router();
const passport = require('passport');

const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getProfileByHandle,
  getProfileByUserId,
  getAllProfiles,
  addExperienceToProfile
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

// DESC     Ways to find/get a profile
// METHODS  GET
// ACCESS   Public
router.route('/handle/:handle').get(getProfileByHandle); // by handle
router.route('/user/:id').get(getProfileByUserId); // by user id
router.route('/all').get(getAllProfiles); // all profiles

router.all('/experience', passport.authenticate('jwt', { session: false }));
router.route('/experience').post(addExperienceToProfile);

module.exports = router;
