var express = require('express');
var router = express.Router();

/*do no response*/
router.get('/', function(req, res, next) {
    res.end('');
});

module.exports = router;
