const gravatar = require('gravatar');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// User model
const User = require('../../../models/User');

// POST '/api/users/register'
exports.registerUser = (req, res) => {
  const { email, name, password, password2 } = req.body;

  // Check if the email is valid
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'That is not a valid email' });
  }

  User.findOne({ email })
    .then(user => {
      // Check if email is already in the database
      if (user) {
        return res.status(400).json({
          email: 'Email already exists'
        });
      }
      // Make sure both password fields are the same
      if (!validator.equals(password, password2)) {
        // Send the error if they don't match
        return res.status(400).json({
          password: 'Passwords must match'
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
            message: 'User successfully created',
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
  const email = req.body.email;
  const password = req.body.password;

  // Validate email before checking credentials
  if (!validator.isEmail(email)) {
    return res.status(400).json({ email: 'Not a valid email' });
  }

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
      res.status(404).json({ error });
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
