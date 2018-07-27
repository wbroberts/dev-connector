const validator = require('validator');

const isEmpty = require('./isEmpty');

// Checks that the social media links are real URLs
const socialMediaValidation = obj => {
  const errors = {};
  const { facebook, linkedin, youtube, instagram, twitter } = obj;

  if (facebook) {
    if (!validator.isURL(facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (linkedin) {
    if (!validator.isURL(linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  if (youtube) {
    if (!validator.isURL(youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (instagram) {
    if (!validator.isURL(instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  if (twitter) {
    if (!validator.isURL(twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  // Check if errors object is empty
  if (!isEmpty(errors)) {
    return errors;
  } else {
    return;
  }
};

module.exports = socialMediaValidation;
