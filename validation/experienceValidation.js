const validator = require('validator');

const isEmpty = require('./isEmpty');

const experienceValidation = obj => {
  const errors = {};

  let { title, company, from } = obj;

  title = !validator.isEmpty(title) ? title : '';
  company = !validator.isEmpty(company) ? company : '';
  from = !validator.isEmpty(from) ? from : '';

  if (validator.isEmpty(title)) {
    errors.title = 'Job title is required';
  }

  if (validator.isEmpty(company)) {
    errors.company = 'Company name is required';
  }

  if (validator.isEmpty(from)) {
    errors.from = 'Job start date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = experienceValidation;
