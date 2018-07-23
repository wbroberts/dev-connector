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
    experience,
    education,
    social
  } = reqBody;

  const profile = {};

  // These are the required fields for a profile
  profile.user = reqUser.id;
  profile.handle = handle;
  profile.status = status;

  // These are the optional fields for a profile
  if (company) profile.company = company;
  if (website) profile.website = webiste;
  if (location) profile.location = location;
  if (skills) profile.skills = skills.split(',');
  if (bio) profile.bio = bio;
  if (experience) profile.experience = experience;
  if (education) profile.education = education;
  if (social) profile.social = social;

  return profile;
};

module.exports = profileFields;
