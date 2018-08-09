const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

// Models
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
// Validation
const userRegistrationValidation = require('../../../validation/userRegistrationValidation');
const loginValidation = require('../../../validation/loginValidation');

// POST '/api/users/register'
const registerUser = (req, res) => {
  const { errors, isValid } = userRegistrationValidation(req.body);

  // Check if there are any errors
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const { email, name, password } = req.body;

  User.findOne({ email })
    .then(user => {
      // Check if email is already in the database
      if (user) {
        errors.email = 'Email already in use';
        throw Error();
      }
    })
    .then(() => {
      // Find or create the generic avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // Create the new user object
      const newUser = new User({ name, email, password, avatar });

      return newUser.save();
    })
    .then(user => {
      const userData = {
        newUser: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: {
            url: user.avatar
          },
          dateCreated: user.date
        }
      };

      res.status(201).json(userData);
    })
    .catch(() => {
      res.status(400).json({ errors });
    });
};

// POST '/api/users/login'
const login = (req, res) => {
  const { errors, isValid } = loginValidation(req.body);
  // Check if there are any errors
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const { email, password } = req.body;

  // Check if the email and password are valid and exist
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
      // Error returned from checkCredentials is either email not found
      // or incorrect password. If error, add it to the errors object.
      error === 'email'
        ? (errors.email = 'User not found')
        : (errors.password = 'Password incorrect');

      res.status(404).json({ errors });
    });
};

// GET '/api/users/current'
const authenticateUser = (req, res) => {
  // Sends back the user object after it was authenticated
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
};

// DELETE '/api/users'
const removeUserAccount = (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => User.findByIdAndRemove(req.user.id))
    .then(() => res.status(200).json({ success: true }));
};

module.exports = {
  registerUser,
  login,
  authenticateUser,
  removeUserAccount
};
