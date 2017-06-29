var express = require('express');
var router = express.Router();

/* send PW */
router.post('/', function(req, res, next) {
  res.send('posting PW');
});

module.exports = router;
