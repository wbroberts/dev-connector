const validator = require('validator');

const isEmpty = require('./isEmpty');

// This is for the client side validation.
// There is backup validation in the User Schema
userRegistrationValidation = obj => {
  const errors = {};

  let { email, password } = obj;

  // Make sure they are empty strings if they are empty
  email = !validator.isEmpty(email) ? email : '';
  password = !validator.isEmpty(password) ? password : '';

  // Check that the fields meet the requirements
  if (!validator.isEmail(email)) {
    errors.email = 'Must be a valid email address';
  }

  // Check that required fields are not empty
  if (validator.isEmpty(email)) {
    errors.email = 'Email is required';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = userRegistrationValidation;
