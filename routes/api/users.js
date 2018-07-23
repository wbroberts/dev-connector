const router = require('express').Router();
const passport = require('passport');

const {
  registerUser,
  login,
  authenticateUser
} = require('./helpers/users-helpers');

// POST   '/api/users/register'
// DESC   User registration path
// ACCESS Public
router.route('/register').post(registerUser);

// POST   '/api/users/login'
// DESC   User login path
// ACCESS Public
router.route('/login').post(login);

// GET    '/api/users/current'
// DESC   Current user authentication
// ACCESS Private
router.all('/current', passport.authenticate('jwt', { session: false }));
router.route('/current').get(authenticateUser);

module.exports = router;
