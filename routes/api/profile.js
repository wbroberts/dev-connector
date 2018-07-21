const router = require('express').Router();
const passport = require('passport');

const { getUserProfile } = require('./helpers/profile-functions');

router.get('/', (req, res) => {
  res.json({
    message: 'This is from the profile route'
  });
});

// GET   '/api/profile'
// DESC   GET user profile
// ACCESS Private
router.all('/api/profile', passport.authenticate('jwt', { session: false }));
router.route('/api/profile').get(getUserProfile);

module.exports = router;
