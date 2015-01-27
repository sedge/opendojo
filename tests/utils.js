var fork = require("child_process").fork,
      child,
      habitat = require('habitat'),
      env = habitat.load('.env'),
      request = require('request'),
      expect = require('chai').expect;

module.exports = {
  initServer: function(done){
    // Spin-up the server as a child process
    child = fork("app.js", null, {});

    // Listen for success, or error with the DB
    child.on('message', function(msg) {
      if ( msg === 'serverStarted' ) {
        return done();
      }
      throw "What happened with the fork?";
    });
    child.on('error', function(err) {
      console.error(err);
      child.kill();
    });
  },

  // Helper function to access API resource routes
  apiSetup: function(verb, route, status, data, callback, customAssertions){
    var fullUrl = env.get('HOST') + env.get('PORT');

    // Parameter handling
    if (route === undefined) {
      status = route;
      route = {};
    } else {
      route = route || {};
    }

    if (typeof(data) === "function") {
      callback = data;
      data = {};
    } else {
      data = data || {};
    }

    callback = callback || function(){};

    customAssertions = customAssertions || function(err, res, body, callback) {
      callback(err, res, body);
    };

    if(route){
      fullUrl += route;
    }

    var assertion = function (err, res, body, callback) {
      if (!body) {
        err = err || "No response body found!";
      }

      customAssertions(err, res, body, callback);
      expect(err).to.not.exist;
      expect(res.statusCode).to.equal(status);
    };

    request({
      url: fullUrl,
      method: verb,
      json: data
    }, function(err, res, body){
      if(err){
        console.log(err + '\n');
      }

      assertion(err, res, body, callback);
    });

  },

  killServer: function(done){
    child.kill();

    done();
  }
};
