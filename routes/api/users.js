const router = require('express').Router();
const passport = require('passport');

const helpers = require('./helpers/users-functions');

// POST   '/api/users/register'
// DESC   User registration path
// ACCESS Public
router.route('/register').post(helpers.registerUser);

// POST   '/api/users/login'
// DESC   User login path
// ACCESS Public
router.route('/login').post(helpers.login);

// GET    '/api/users/current'
// DESC   Current user authentication
// ACCESS Private
router.all('/current', passport.authenticate('jwt', { session: false }));
router.route('/current').get(helpers.authenticateUser);

module.exports = router;
