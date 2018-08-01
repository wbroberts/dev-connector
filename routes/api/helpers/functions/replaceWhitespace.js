// This is to ensure that the handles do not include whitespace.
// Defaults to '-' for URL use.
const replaceWhitespace = (str, replacement = '-') => {
  str = str.toLowerCase().trim();

  // Exit out of function early if no whitespace
  if (!str.includes(' ')) return str;
  // Replace all instances of whitespace with replacement
  str = str.replace(/\s/g, replacement);

  return str;
};

module.exports = replaceWhitespace;
