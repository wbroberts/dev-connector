const router = require('express').Router();
const helper = require('./users-helpers/users-functions');

// REGISTER
router.route('/register').post(helper.registerUser);

module.exports = router;
