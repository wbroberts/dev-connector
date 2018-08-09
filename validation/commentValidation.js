const validator = require('validator');

const isEmpty = require('./isEmpty');

commentValidation = obj => {
  const errors = {};

  let { body } = obj;

  // Make sure the text field is empty text if it is empty
  body = !validator.isEmpty(body) ? body : '';

  // Check that required fields are not empty
  if (validator.isEmpty(body)) {
    errors.comment = 'Comment text is required';
  }

  if (!validator.isLength(body, { max: 300 })) {
    errors.comment = 'Comment cannot be over 300 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = commentValidation;
