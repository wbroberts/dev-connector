const expect = require('expect');

const educationValidation = require('../../validation/educationValidation');

describe('educationValidation function', () => {
  it('should not return any errors', () => {
    const education = {
      school: 'U of U',
      degree: 'BS',
      fieldOfStudy: 'Psychology',
      from: Date.now.toString(),
      current: true,
      description: 'studying psychology and business'
    };

    expect(educationValidation(education).isValid).toBe(true);
  });

  it('should return errors (school, degree, fieldOfStudy)', () => {
    const education = {
      school: '',
      degree: '',
      fieldOfStudy: '',
      from: Date.now.toString(),
      current: true,
      description: 'studying psychology and business'
    };

    expect(educationValidation(education).isValid).toBe(false);
    expect(educationValidation(education).errors.school).toBe(
      'School is required'
    );
    expect(educationValidation(education).errors.degree).toBe(
      'Degree is required'
    );
    expect(educationValidation(education).errors.fieldOfStudy).toBe(
      'Area of study is required'
    );
  });
});
