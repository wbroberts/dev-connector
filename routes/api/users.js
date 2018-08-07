const router = require('express').Router();
const passport = require('passport');

const {
  registerUser,
  login,
  authenticateUser,
  removeUserAccount
} = require('./helpers/users-helpers');

// ROUTE    /api/users/register
// DESC     User registration path
// METHOD   POST
// ACCESS   Public
router.route('/register').post(registerUser);

// ROUTE    /api/users/login
// DESC     User login path
// ACCESS   Public
router.route('/login').post(login);

// Routes that require authentication
// ACCESS   Private
router.all(['/current', '/'], passport.authenticate('jwt', { session: false }));

// ROUTE    /api/users/current
// DESC     Returns the current user that is logged in and authenticated
// METHOD   GET
// ACCESS   Private
router.route('/current').get(authenticateUser);

// ROUTE    /api/users
// DESC     Deletes the user's profile and account
// METHOD   DELETE
// ACCESS   Private
router.route('/').delete(removeUserAccount);

module.exports = router;
