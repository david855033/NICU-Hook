var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");


router.get('/*', function(req, res, next) { 
  if(req.baseUrl&&(req.baseUrl.indexOf("remote")>=0||req.baseUrl.indexOf("favicon")>=0))
  {
    next();
  }

  console.log(req.baseUrl);
  var options=
  {
      hostname:"localhost",
      path: req.baseUrl,
      port:3010
  };

  var contentType="text/html";
  if(req.baseUrl.indexOf(".js")>=0)
  {
    contentType='application/x-javascript';
  }else if(req.baseUrl.indexOf(".css")>=0)
  {
    contentType='text/css';
  }
  res.setHeader('content-type', contentType);

  var httpConnection = http.request(options,
          function(httpResponse){
              var output="";
              httpResponse.on('data',function(chunk){
                output+=chunk;
              });
              httpResponse.on('end',function(){
                res.end(output);
              });
          });

      httpConnection.on('error',function(err){
        res.setHeader('content-type', 'application/x-javascript');
        res.end("console.log('ERR "+req.baseUrl+"');");
      });

      httpConnection.end();
});

module.exports = router;
