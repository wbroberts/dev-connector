const validator = require('validator');

const isEmpty = require('./isEmpty');

// This is for the client side validation.
// There is backup validation in the User Schema
userRegistrationValidation = obj => {
  const errors = {};

  let { email, name, password, password2 } = obj;

  // Make sure they are empty strings if they are empty
  email = !validator.isEmpty(email) ? email : '';
  name = !validator.isEmpty(name) ? name : '';
  password = !validator.isEmpty(password) ? password : '';
  password2 = !validator.isEmpty(password2) ? password2 : '';

  // Check that required fields are not empty
  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(name)) {
    errors.name = 'Name is required';
  }
  // Email validation
  if (!validator.isEmail(email)) {
    errors.email = 'Must be a valid email address';
  }

  if (validator.isEmpty(email)) {
    errors.email = 'Email is required';
  }
  // Password validation(s)
  if (!validator.isLength(password, { min: 6, max: 20 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password is required';
  }

  if (validator.isEmpty(password2)) {
    errors.password2 = 'Confirm password is required';
  }

  if (!validator.equals(password, password2)) {
    errors.passwords = 'Passwords must match';
  }

  return {
    errors,
    // If errors is empty, then isValid is true
    isValid: isEmpty(errors)
  };
};

module.exports = userRegistrationValidation;
