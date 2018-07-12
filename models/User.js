const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Create Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minLength: 1,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6
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
  // Check if the password is changed
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
