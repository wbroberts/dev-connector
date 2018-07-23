const router = require('express').Router();

router.get('/test', (req, res) => {
  res.json({
    message: 'This is the posts route'
  });
});

module.exports = router;
