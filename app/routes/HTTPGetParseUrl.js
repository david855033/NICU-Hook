var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

/* get reqeust to url*/
router.get('/*', function(req, res, next) { 
  var options=
  {
      hostname:"localhost",
      path: '/remote'+req.baseUrl,
      port:3010,
      Portacal:http
  };
  
  // var options=
  // {
  //     hostname:"david855033.github.io",
  //     path: req.baseUrl,
  //     Portacal:https
  // };

  if(!req.baseUrl){options.path+="/index.html";}
  var Portacal=options.Portacal;
  console.log(":::parse get request to: "+options.path);

  var contentType="text/html";
  if(req.baseUrl.indexOf(".js")>=0)
  {
    contentType='application/x-javascript';
  }else if(req.baseUrl.indexOf(".css")>=0)
  {
    contentType='text/css';
  }
  res.setHeader('content-type', contentType);

  var httpConnection = Portacal.request(options,
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
        res.end("console.log('ERR "+options.path+"');");
      });

      httpConnection.end();
});

module.exports = router;
