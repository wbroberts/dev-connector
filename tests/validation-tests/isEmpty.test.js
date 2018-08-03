const expect = require('expect');

const isEmpty = require('../../validation/isEmpty');

describe('isEmpty function', () => {
  it('should return true when object is empty', () => {
    const obj = {};
    expect(isEmpty(obj)).toBe(true);
  });

  it('should return false when object is not empty', () => {
    const obj = { empty: false };
    expect(isEmpty(obj)).toBe(false);
  });
});
