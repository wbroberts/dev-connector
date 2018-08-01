const replaceWhitespace = require('./replaceWhitespace');
// Takes in the req.user and req.body as params.
// Returns a profile object for creating a new profile.
const profileFields = (reqUser, reqBody) => {
  const {
    handle,
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    social
  } = reqBody;

  const profile = {};

  // These are the required fields for a profile
  profile.user = reqUser.id;
  profile.status = status;
  profile.skills = skills.split(',');
  profile.handle = replaceWhitespace(handle);

  // These are the optional fields for a profile
  if (company) profile.company = company;
  if (website) profile.website = webiste;
  if (location) profile.location = location;
  if (bio) profile.bio = bio;
  if (githubusername) profile.githubusername = githubusername;

  // Social media optional fields
  profile.social = {};
  if (social) {
    if (social.youtube) profile.social.youtube = social.youtube;
    if (social.twitter) profile.social.twitter = social.twitter;
    if (social.facebook) profile.social.facebook = social.facebook;
    if (social.linkedin) profile.social.linkedin = social.linkedin;
    if (social.instagram) profile.social.instagram = social.instagram;
  }

  return profile;
};

module.exports = profileFields;
