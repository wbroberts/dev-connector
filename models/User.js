const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [30, 'Name is too long. Max length is 30 characters'],
    minlength: [2, 'Name is too short. Must be at least 2 characters'],
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Salt and hash password before it is saved
userSchema.pre('save', function(next) {
  // Check if the password is changed and then salt/hash it
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        // Set password to the hash
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Check login credentials
userSchema.statics.checkCredentials = function(email, password) {
  return this.findOne({ email }).then(user => {
    // See if a user is NOT found a return an error
    if (!user) {
      return Promise.reject('email');
    }

    // Check password
    return new Promise((resolve, reject) => {
      // Does password match the hashed password
      return bcrypt.compare(password, user.password, (error, result) => {
        if (!result) {
          return reject('password');
        } else {
          return resolve(user);
        }
      });
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
