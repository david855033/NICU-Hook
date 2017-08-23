var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

/* transfered post data to HTTP request, called by html framework */
router.post('/', function(req, res, next) {
    var options=req.body;

    //讀取http protocal並設定default port
    var connection = http;
    if(options.HTTPprotocol=="HTTPS"){
      console.log('HTTPS');
      connection=https;
      if(!options.port){options.port='443';}
    }else{
      if(!options.port){options.port='80';}
    }
    delete options.HTTPprotocol;

    console.log("::::: Send http request, option: "+ JSON.stringify(options));

      var httpConnection = connection.request(options,
          function(httpResponse){
              var output="";

              httpResponse.on('data',function(chunk){
                output+=chunk;
              });

              httpResponse.on('end',function(){
                console.log(output);
                res.send(output);
              });
          });

      httpConnection.on('error',function(err){
          console.log('ERR '+err.stack);
          res.send("HTTP Request failed-> "+err);
      });

      httpConnection.end();
});

module.exports = router;
