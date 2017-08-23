var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var HTTPGetParseUrl = require('./routes/HTTPGetParseUrl');
var HTTPRequest = require('./routes/HTTPRequest');
var NoResponse = require('./routes/NoResponse');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/*HTTPRequest*',HTTPRequest);   //接受post request, 將內容作為HTTPRequest送出
app.use('/favicon*',NoResponse);
app.use('/remote/remote*',NoResponse);  //如果再local端找不到檔案，中斷連續迴圈
app.use('/*', HTTPGetParseUrl);    //除了HTTPRequest的get,都會被轉到指定Url（在HTTPGetParseUrl內定義伺服器位置），用來放repo的資料

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
