/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var router = require('express').Router();
var env = require('../lib/environment');
var log = require('../lib/logger');
var User = require("../models")(require("../lib/db")).User;
var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = function() {
  router.get('/token', function(req, res) {
    if (!req.headers.username || !req.headers.password) {
      log.warn({
        req: req
      });

      return res.status(401).send('Authentication process failed');
    }

    // Fetch the appropriate user, if they exist
    User.findOne({
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

        if (!isMatch) {
          log.warn({
            err: err,
            req: req
          });

          return res.status(401).send('Authentication process failed');
        }

        var expiry = moment().add(8, 'hours').valueOf();

        var token = jwt.encode({
          iss: user._id,
          username: user.username,
          exp: expiry
        }, env.get("AUTH_SECRET"));

        log.info({
          req: req,
          res: res
        });

        return res.status(200).json({
          token: token
        });
      });
    });
  });

  return router;
}();
