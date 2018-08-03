const experienceFields = reqBody => {
  const experience = {};

  Object.keys(reqBody).forEach(item => {
    // These are the three required experience fields
    if (item === ('title' || 'company' || 'from')) {
      experience[item] = reqBody[item];
    } else {
      // This is for the optional fields
      if (item) experience[item] = reqBody[item];
    }
  });

  return experience;
};

module.exports = experienceFields;
