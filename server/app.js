var express = require('express');
var path = require('path');

var log = require('./lib/logger');
var env = require('./lib/environment');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression')();

var routes = require('./routes');
var jwtAuth = require('./routes/middleware/jwtAuth');
var jwtRegen = require('./routes/middleware/jwtRegen');

var app = module.exports = express();

app.use(compression);

app.use(express.static(path.join(__dirname, './views')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/quill/dist'));

app.disable("x-powered-by");

// TODO: Add favicon. See https://github.com/sedge/opendojo/issues/10
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes.auth);

app.use('/api', jwtAuth, jwtRegen, routes.attendance);
app.use('/api', jwtAuth, jwtRegen, routes.course);
app.use('/api', jwtAuth, jwtRegen, routes.rank);
app.use('/api', jwtAuth, jwtRegen, routes.student);
app.use('/api', jwtAuth, jwtRegen, routes.email);
app.use('/api', jwtAuth, jwtRegen, routes.message);

app.set('jwtTokenSecret', env.get("AUTH_SECRET"));

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
