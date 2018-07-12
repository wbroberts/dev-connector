const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message: 'This is from the profile route'
  });
});

module.exports = router;
