const validator = require('validator');

const isEmpty = require('./isEmpty');

// Checks that the social media links are real URLs
const socialMediaValidation = obj => {
  const errors = {};
  // Iterate over each key and check if it is a valid URL
  Object.keys(obj).map(key => {
    if (!validator.isURL(obj[key])) {
      errors[key] = 'Not a valid URL';
    }
  });

  // Check if errors object is empty
  if (!isEmpty(errors)) {
    return errors;
  } else {
    return;
  }
};

module.exports = socialMediaValidation;
