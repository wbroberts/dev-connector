// This is to ensure that the handles do not include whitespace.
// Defaults to '-' for URL use.
const replaceWhitespace = (str, replacement = '-') => {
  // Replace all instances of whitespace with replacement
  return str
    .trim()
    .replace(/\s/g, replacement)
    .toLowerCase();
};

module.exports = replaceWhitespace;
