var express = require('express');
var router = express.Router();
var http = require('http');

/* get HTML */
router.use('/', function(req, res, next) {
    var option=req.body;
    console.log("http request! option sended:\n"+ JSON.stringify(option));
    
    const httpReq =http.request(option,(httpRes)=>{
      console.log(`STATUS: ${httpRes.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(httpRes.headers)}`);
      httpRes.setEncoding('utf8');
      httpRes.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });
    httpReq.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    res.end();
});

module.exports = router;
