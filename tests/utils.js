var fork = require("child_process").fork,
      child,
      habitat = require('habitat'),
      env = habitat.load('.env'),
      request = require('request'),
      expect = require('chai').expect,
      fullUrl = env.get('HOST') + ':' + env.get('PORT');

module.exports = {
  initServer: function(done){
    // Spin-up the server as a child process
    child = fork("./server/www", null, {});

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
    // Parameter handling
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

    request({
      url: fullUrl + route,
      method: verb,
      json: data
    }, function(err, res, body){
      if (err) throw(err);

      expect(res.statusCode).to.equal(status);
      customAssertions(err, res, body, callback);
    });
  },

  killServer: function(done){
    child.kill();
    done();
  }
};
