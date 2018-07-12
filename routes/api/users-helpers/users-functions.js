const gravatar = require('gravatar');

// User model
const User = require('../../../models/User');

// POST user Route
exports.registerUser = (req, res) => {
  const email = req.body.email;

  User.findOne({ email })
    .then(user => {
      // Check if email is already in the database
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }
      // Find or create the avatar
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
      // Create the new user object
      const newUser = new User({
        name: req.body.name,
        email,
        password: req.body.password,
        avatar
      });
      // Return to limit the indentations
      return newUser;
    })
    .then(newUser => {
      // Save the user to the database
      newUser
        .save()
        .then(result => {
          res.json({
            result: {
              _id: result._id,
              email: result.email,
              avatar: {
                url: result.avatar
              },
              dateCreated: result.date
            }
          });
        })
        .catch(error => {
          res.json({ error });
        });
    })
    .catch(error => {
      res.json({ error });
    });
};

module.exports = exports;
