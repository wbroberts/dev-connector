const validator = require('validator');

const isEmpty = require('./isEmpty');

const experienceValidation = obj => {
  const errors = {};

  let { title, company, from } = obj;

  // Required fields
  title = !validator.isEmpty(title) ? title : '';
  company = !validator.isEmpty(company) ? company : '';
  from = !validator.isEmpty(from) ? from : '';

  // Title validation
  if (!validator.isLength(title, { min: 2, max: 30 })) {
    errors.title = 'Job title must be between 2 and 30 characters';
  }

  if (validator.isEmpty(title)) {
    errors.title = 'Job title is required';
  }

  // Company validation
  if (!validator.isLength(company, { min: 2, max: 30 })) {
    errors.company = 'Company name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(company)) {
    errors.company = 'Company name is required';
  }

  // From validation
  if (validator.isEmpty(from)) {
    errors.from = 'Job start date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = experienceValidation;
