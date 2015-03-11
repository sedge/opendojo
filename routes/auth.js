var router = require('express').Router(),
    env = require('../lib/environment'),
    log = require('../lib/logger'),
    db = require('../db'),
    moment = require('moment'),
    jwt = require('jwt-simple');

module.exports = function() {
  router.get('/token', function(req, res) {
    if (req.headers.username && req.headers.password) {
      // Fetch the appropriate user, if they exist
      db.mongoose.models.User.findOne({
        username: req.headers.username
      }, function(err, user) {
        if (err) {
          log.warn({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        if (!user) {
          // user cannot be found
          return res.status(401).send('Authentication process failed');
        }

        user.comparePassword(req.headers.password, function(err, isMatch) {
          if (err) {
            log.warn({
              err: err,
              req: req
            });

            return res.status(401).send('Authentication process failed');
          }

		  else if (isMatch) {
            var expiry = moment().add(8, 'hours').valueOf();

            var token = jwt.encode({
              iss: user._id,
              exp: expiry
            }, env.get("AUTH_SECRET"));

            log.info({
              req: req,
              res: res
            });

            res.status(200).json({
              token: token
            });
          }

		  else {
            res.status(401).send('Authentication process failed');
          }
        });
      });
    }

	else {
      log.warn({
        req: req
      });

      res.status(401).send('Authentication process failed');
    }
  });

  return router;
}();
