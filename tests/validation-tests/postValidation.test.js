const expect = require('expect');

const postValidation = require('../../validation/postValidation');

describe('postValidation function', () => {
  it('should be a valid post', () => {
    const post = { text: 'This is a post with enough characters' };
    const valid = postValidation(post);

    expect(valid.isValid).toBe(true);
  });

  it('should return an error (Text is required)', () => {
    const post = { text: '' };
    const valid = postValidation(post);

    expect(valid.isValid).toBe(false);
    expect(valid.errors.text).toBe('Text is required');
  });

  it('should return an error (text length)', () => {
    const post = { text: 'fail' };
    const valid = postValidation(post);

    expect(valid.isValid).toBe(false);
    expect(valid.errors.text).toBe(
      'Text must be between 10 and 300 characters'
    );
  });
});
