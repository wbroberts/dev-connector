const expect = require('expect');

const loginValidation = require('../../validation/loginValidation');

describe('loginValidation function', () => {
  it('should not return any errors', () => {
    const login = {
      email: 'person@email.com',
      password: 'password'
    };
    const validation = loginValidation(login);

    expect(validation.isValid).toBe(true);
    expect(validation.errors.email).not.toBeDefined();
  });

  it('should return errors', () => {
    const login = { email: '', password: 'password' };
    const validation = loginValidation(login);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.email).toBe('Email is required');
  });
});
