/**
 * jwtAuth
 *
 *  A simple middleware-exposing file for parsing a JWt token attached to the request.
 *  If the token is valid, the corresponding user will be attached to the request.
 *
 *  Credit for this file's logic goes to Lukas White, thanks to his open-source tutorial on JWTs with Node/Express.js:
 *  http://www.sitepoint.com/using-json-web-tokens-node-js/
 */
var db = require('../../lib/db');
var jwt = require('jwt-simple');
var env = require('../../lib/environment');

module.exports = function(req, res, next) {
  var token = req.headers["x-access-token"];

  if (!token) {
    log.warn({
      req: req
    });

    return res.status(401).send('Authentication process failed');
  }

  var decoded = jwt.decode(token, env.get('AUTH_SECRET'));
  if (decoded.exp <= Date.now()) {
    log.warn({
      req: req
    });

    return res.status(400).send('Access token has expired');
  }

  db.mongoose.models.User.findOne({
    '_id': decoded.iss
  }, function(err, user) {
    if (err) {
      log.warn({
        user: user,
        err: err
      });

      res.status(401).send('Authentication process failed');
    }

    req.token = token;
    req.user = user;

    return next();
  });
};
