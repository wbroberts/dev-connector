const expect = require('expect');

const profileValidation = require('../../validation/profileValidation');

describe('profileValidation function', () => {
  it('should not return any errors', () => {
    const profile = {
      handle: 'handle',
      status: 'working',
      skills: ['HTML', 'JavaScript'],
      social: { instagram: 'www.instagram.com/handle' },
      website: 'www.web.com'
    };
    const validation = profileValidation(profile);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.handle).not.toBeDefined();
  });

  it('should return errors', () => {
    const profile = {
      handle: '',
      status: 'working',
      skills: ['HTML'],
      social: { instagram: 'instagram' },
      website: 'webcom'
    };
    const validation = profileValidation(profile);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.handle).toBe('Handle is required');
    expect(validation.errors.social.instagram).toBeDefined();
    expect(validation.errors.website).toBeDefined();
  });
});
