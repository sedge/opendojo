/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

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
