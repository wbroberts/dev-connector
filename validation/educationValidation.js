const validator = require('validator');

const isEmpty = require('./isEmpty');

const experienceValidation = obj => {
  const errors = {};

  let { school, degree, fieldOfStudy, from } = obj;

  // Required fields
  school = !validator.isEmpty(school) ? school : '';
  degree = !validator.isEmpty(degree) ? degree : '';
  fieldOfStudy = !validator.isEmpty(fieldOfStudy) ? fieldOfStudy : '';
  from = !validator.isEmpty(from) ? from : '';

  if (validator.isEmpty(school)) {
    errors.school = 'School is required';
  }

  if (validator.isEmpty(fieldOfStudy)) {
    errors.fieldOfStudy = 'Area of study is required';
  }

  if (validator.isEmpty(degree)) {
    errors.degree = 'Degree is required';
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
