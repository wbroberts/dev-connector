const validator = require('validator');

const isEmpty = require('./isEmpty');
const socialMediaValidation = require('./socialMediaValidation');

// Returns an errors object if there are any errors
const profileValidation = obj => {
  const errors = {};
  // The required profile fields to validate
  let { handle, status, skills, website, social } = obj;

  handle = !validator.isEmpty(handle) ? handle : '';
  status = !validator.isEmpty(status) ? status : '';
  skills = !isEmpty(skills) ? skills : '';

  // Handle errors
  if (validator.isEmpty(handle)) {
    errors.handle = 'Handle is required';
  }

  if (!validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle must be between 2 and 40 characters';
  }
  // Status errors
  if (validator.isEmpty(status)) {
    errors.status = 'Status is required';
  }
  // Skills errors
  if (isEmpty(skills)) {
    errors.skills = 'You must have at least one skill';
  }

  // Make sure website is a valid URL
  if (!isEmpty(website)) {
    if (!validator.isURL(website)) {
      errors.website = 'Not a valid URL';
    }
  }

  social = socialMediaValidation(social);

  if (!isEmpty(social)) errors.social = social;

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = profileValidation;
