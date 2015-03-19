var env = require('../lib/environment');
var request = require('request');
var expect = require('chai').expect;
var fullUrl = env.get('HOST') + ':' + env.get('PORT');
var log = require('../lib/logger');
var server = require('../server/www').server;

var dbHealth = require('../db').dbHealth;

module.exports = {
  // Helper function to access API resource routes
  initServer: function(done){
    function startServer() {
      server.listen(env.get("PORT"), done);

      server.on('error', function(err) {
        expect(err).to.not.exist;
      });      
    }

    if (dbHealth.connected) {
      startServer();
    } else {
      dbHealth.on('connected', startServer);
    }
  },
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
    server.close(done);
  }
};
