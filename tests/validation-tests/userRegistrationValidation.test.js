const expect = require('expect');

const userRegistrationValidation = require('../../validation/userRegistrationValidation');

describe('userRegistrationValidation function', () => {
  it('should return not return any errors', () => {
    const user = {
      name: 'User',
      email: 'user@email.com',
      password: 'password',
      password2: 'password'
    };
    const validation = userRegistrationValidation(user);

    expect(validation.isValid).toBe(true);
  });

  it('should return errors', () => {
    const user = {
      name: '',
      email: 'user@email.com',
      password: 'password',
      password2: 'passw'
    };
    const validation = userRegistrationValidation(user);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.name).toBeDefined();
    expect(validation.errors.passwords).toBeDefined();
  });
});
