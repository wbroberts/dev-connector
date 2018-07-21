// Load Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// GET '/api/profile'
exports.getUserProfile = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

module.exports = exports;
