var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

/* parse get reqeust to url, in dev enviroment, is remote, else is my repo*/
router.get('/*', function(req, res, next) { 
  var options=    //for dev
  {
      hostname:"localhost",
      path: '/remote'+req.baseUrl,
      port:3010,
      Protocal:http
  };

  // var options=    //for pub
  // {
  //     hostname:"david855033.github.io",
  //     path: req.baseUrl,
  //     Protocal:https
  // };

  //if(!req.baseUrl){options.path+="/index.html";}
  var Protocal=options.Protocal;
 

  var contentType="text/html"; //default
  if(req.baseUrl.indexOf(".jsp")>=0)
  {
    contentType ="text/html";
  }else if(req.baseUrl.indexOf(".js")>=0)
  {
    contentType='application/x-javascript';
  }else if(req.baseUrl.indexOf(".css")>=0)
  {
    contentType='text/css';
  }else if(req.baseUrl.indexOf(".png")>=0)
  {
    contentType='image/png';
  }else if(req.baseUrl.indexOf(".ico")>=0)
  {
    contentType='image/x-icon';
  }else if(req.baseUrl.indexOf(".gif")>=0)
  {
    contentType='image/gif';
  }  else if(req.baseUrl.indexOf(".jpg")>=0)
  {
    contentType='image/jpg';
  }

  console.log(":::parse get request to: "+options.hostname + options.path+", type: "+contentType);

  res.setHeader('content-type', contentType);
  var httpConnection = Protocal.request(options,
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
        console.log('Err Message=> '+err)
        res.end("ERR: "+options.hostname + options.path);
      });

      httpConnection.end();
});

module.exports = router;
