var express = require('express');
var path = require('path');
var log = require('./lib/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = module.exports = express();

// render without jade for templating
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(__dirname + '/public'));

app.disable("x-powered-by");

// TODO: Add favicon. See https://github.com/sedge/opendojo/issues/10
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to the dynamic routes file
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (err.status === 404) {
    log.warn({
      req: req,
      res: res
    });
  } else {
    log.error({
      err: err,
      req: req,
      res: res
    });
  }

  res.status(err.status || 500);
  res.send({
    message: "Internal server error. See server logs for details."
  });
});
