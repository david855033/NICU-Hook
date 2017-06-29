var express = require('express');
var router = express.Router();

/* send PW */
router.get('/', function(req, res, next) {
  res.send('getting HTML');
});

module.exports = router;
