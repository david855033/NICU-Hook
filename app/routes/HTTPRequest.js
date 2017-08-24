var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

/* transfered post data to HTTP request, called by html framework */
router.post('/', function(expReq, expRes, next) {
    var options=expReq.body;

    //讀取http protocal並設定default port
    var nodeConn = http;
    if(options.HTTPprotocol=="HTTPS"){
      nodeConn=https;
      options.port=options.port||'443';
    }else{
      options.port=options.port||'80';
    }
    delete options.HTTPprotocol;

    console.log("::::: Send http request, option: "+ JSON.stringify(options));

      var nodeReq = nodeConn.request(options,
        function(nodeRes){
          var output="";
          nodeRes.on('data',function(chunk){
            output+=chunk;
          });
          
          nodeRes.on('end',function(){
            var headers=nodeRes.headers;
            var setcookie=headers['set-cookie'];
            var c= JSON.stringify(setcookie);
            console.log(c);
            expRes.send(output+c);
          });
        }
      );

      nodeReq.on('error',function(err){
        console.log('ERR '+err.stack);
        expRes.send("HTTP Request failed-> "+err);
      });

      options.postData && nodeReq.write(options.postData);

      nodeReq.end();
});

module.exports = router;
