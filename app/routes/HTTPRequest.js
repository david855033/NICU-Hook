var express = require('express');
var router = express.Router();
var request = require('request');
var cookieParser = require('cookie-parser')

/* transfered post data to HTTP request, called by html framework */
router.post('/', function(expReq, expRes, next) {
    var option=expReq.body;
    console.log("> Request to server: "+option.url);
    option.jar=request.jar();    
    
    request(option, function (error, response, body) {
      console.log('>>> recieved statusCode:', response && response.statusCode); // Print the response status code if a response was received
      var cookieString=option.jar.getCookieString(option.url);
      var body=JSON.stringify(body);
      var response=JSON.stringify(response);
      expRes.send({body:body,cookieString:cookieString,response:response});
    });

});

module.exports = router;
