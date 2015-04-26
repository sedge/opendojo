var env = require('../../lib/environment');
var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  var existingToken = req.token;

  if (!existingToken) {
    return next(err);
  }

  else {
    var decoded = jwt.decode(existingToken, env.get('AUTH_SECRET'));

    if (decoded.exp > Date.now()) {
      var expiry = moment().add(8, 'hours').valueOf();

      var token = jwt.encode({
        iss: req.user._id,
        username: req.user.username,
        exp: expiry
      }, env.get('AUTH_SECRET'));

      req.token = JSON.stringify(token);

      return next();
    }
  }
};
