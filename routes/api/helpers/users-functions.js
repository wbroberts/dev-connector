const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

// User model
const User = require('../../../models/User');
// Validation
const userRegistrationValidation = require('../../../validation/userRegistrationValidation');
const loginValidation = require('../../../validation/loginValidation');

// POST '/api/users/register'
exports.registerUser = (req, res) => {
  const { errors, isValid } = userRegistrationValidation(req.body);
  // Check if there are any errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, name, password, password2 } = req.body;

  User.findOne({ email })
    .then(user => {
      // Check if email is already in the database
      if (user) {
        return res.status(400).json({
          email: 'Email already exists'
        });
      }
      // Find or create the generic avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // Create the new user object
      const newUser = new User({ name, email, password, avatar });
      // Save the new user to the database
      newUser
        .save()
        .then(result => {
          res.json({
            message: 'Success',
            // Sends everything but the password
            user: {
              _id: result._id,
              email: result.email,
              name: result.name,
              avatar: {
                url: result.avatar
              },
              dateCreated: result.date
            }
          });
        })
        .catch(error => {
          // Save newUser error
          res.status(400).json({ error });
        });
    })
    .catch(error => {
      // FindOne error
      res.json({ error });
    });
};

// POST '/api/users/login'
exports.login = (req, res) => {
  const { errors, isValid } = loginValidation(req.body);
  // Check if there are any errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  // Check if the email is
  User.checkCredentials(email, password)
    .then(user => {
      // User info for payload
      const payload = {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      };
      // Sign token
      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: '1h' },
        (error, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        }
      );
    })
    .catch(error => {
      // Error is either email not found or incorrect password
      error === 'email'
        ? (errors.email = 'User not found')
        : (errors.password = 'Password incorrect');

      res.status(404).json(errors);
    });
};

// GET '/api/users/current'
exports.authenticateUser = (req, res) => {
  // Sends back the user object after it was authenticated
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
};

module.exports = exports;
