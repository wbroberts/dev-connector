const validator = require('validator');

const isEmpty = require('./isEmpty');

postValidation = obj => {
  const errors = {};

  let { text } = obj;

  // Make sure the text field is empty text if it is empty
  text = !validator.isEmpty(text) ? text : '';

  // Check that required fields are not empty
  if (!validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = 'Text must be between 10 and 300 characters';
  }

  if (validator.isEmpty(text)) {
    errors.text = 'Text is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = postValidation;
