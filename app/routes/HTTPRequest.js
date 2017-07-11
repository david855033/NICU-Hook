var express = require('express');
var router = express.Router();
var http = require("http");

/* transfered post data to HTTP request for VGHServer, called by html framework */
router.post('/', function(req, res, next) {
    var options=req.body;
    console.log("::::: Send http request, option: "+ JSON.stringify(options));
    
    var TestCookieNumber=2;
    options.cookieContainer && (TestCookieNumber = Number(options.cookieContainer) + 1) ;

    res.set('cookie-container', TestCookieNumber );

      var httpConnection = http.request(options,
          function(httpResponse){
              var output="";

              httpResponse.on('data',function(chunk){
                output+=chunk;
              });

              httpResponse.on('end',function(){
                res.send(output);
              });
          });

      httpConnection.on('error',function(err){
        console.log('ERR '+err.stack);
          res.send("ERR");
      });

      httpConnection.end();
});

module.exports = router;
