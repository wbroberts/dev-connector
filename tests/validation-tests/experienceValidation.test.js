const expect = require('expect');

const experienceValidation = require('../../validation/experienceValidation');

describe('experienceValidation function', () => {
  it('should return no errors', () => {
    const experience = {
      title: 'A Job',
      company: 'Forturn 500 Company',
      from: 'Aug 2010',
      to: 'current'
    };

    expect(experienceValidation(experience).isValid).toBe(true);
    expect(experienceValidation(experience).errors.company).not.toBeDefined();
  });

  it('should return errors (title, company)', () => {
    const experience = {
      title: '',
      company: 'F',
      from: 'Aug 2010',
      to: 'current'
    };

    expect(experienceValidation(experience).isValid).toBe(false);
    expect(experienceValidation(experience).errors.title).toBe(
      'Job title is required'
    );
    expect(experienceValidation(experience).errors.company).toBe(
      'Company name must be between 2 and 30 characters'
    );
  });
});
