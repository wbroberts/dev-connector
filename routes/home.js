const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'This is from the homepage route'
  });
});

module.exports = router;
