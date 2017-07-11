var express = require('express');
var router = express.Router();
var http = require("http");

/* transfered post data to HTTP request, called by framework */
router.post('/', function(req, res, next) {
    var options=req.body;
    console.log("::::: Sedn http request, option: "+ JSON.stringify(options));

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
