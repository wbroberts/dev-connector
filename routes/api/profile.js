const router = require('express').Router();
const passport = require('passport');

const {
  getUserProfile,
  createUserProfile
} = require('./helpers/profile-functions');

router.get('/test', (req, res) => {
  res.json({
    message: 'This is from the profile route'
  });
});

// GET   '/api/profile'
// DESC   GET user profile
// DEST   POST create profile
// ACCESS Private
router.all('/', passport.authenticate('jwt', { session: false }));
router
  .route('/')
  .get(getUserProfile)
  .post(createUserProfile);

module.exports = router;
