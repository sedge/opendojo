/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var env = require('../server/lib/environment');
var request = require('request');
var expect = require('chai').expect;
var fullUrl = env.get('HOST') + ':' + env.get('PORT');
var log = require('../server/lib/logger');
var server = require('../server/www').server;

server.on('error', function(err) {
  expect(err).to.not.exist;
});

var health = require('../server/lib/db').health;

module.exports = {
  // Helper function to safely start the node server for unit tests
  initServer: function(done) {

    function startServer() {
      server.listen(env.get("PORT"), done);
    }

    if (health.connected) {
      startServer();
      health.removeListener('connected', startServer);
    } else {
      health.on('connected', startServer);
    }
  },
  // Helper function to wrap the token route and conveniently send back
  // relevant response data
  jwtSetup: function(options, callback) {
    if (!callback) expect(true, " [callback wasn't passed to jwtSetup] ").to.be.false;

    request.get(fullUrl + '/token', options, function(err, res, body) {
      if (err) expect(err).to.not.exist;

      // We don't want this JSON parser to err out if we're
      // trying to force a 401 with intentionally faulty data
      if (res.statusCode == 200) {
        try {
          var bodyObj = JSON.parse(body);
          var validToken = bodyObj.token;
          var authInfo = {
            "x-access-token": validToken
          };
        } catch (e) {
          expect(e, "Error parsing " + body + " as JSON.").to.not.exist;
        }
      }

      callback(null, res, body, authInfo);
    });
  },
  // Helper function to access all server-side API routes
  // in a REST API Client-like fashion
  apiSetup: function(verb, route, status, headerVals, data, callback, customAssertions) {
    // Parameter handling
    if (typeof(data) === "function") {
      callback = data;
      data = {};
    } else {
      data = data || {};
    }

    callback = callback || function() {};

    customAssertions = customAssertions || function(err, res, body, callback) {
      callback(err, res, body);
    };

    request({
      url: fullUrl + route,
      method: verb,
      headers: headerVals,
      json: data
    }, function(err, res, body) {
      if (err) throw (err);

      expect(res.statusCode).to.equal(status);
      customAssertions(err, res, body, callback);
    });
  },
  // Helper function to safely close the node server after completing
  // the predefined test suites
  killServer: function(done) {
    server.close(done);
  }
};
