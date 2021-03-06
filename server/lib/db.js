/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var EventEmitter = require('events').EventEmitter;
var mongoose = require('mongoose');

var env = require('./environment');
var log = require('./logger');

var health = new EventEmitter();
health.connected = false;

var connection = mongoose.connection;

connection.on('disconnected', function () {
  log.info('Mongoose default connection disconnected');
  process.exit(1);
});

connection.on('error', function(error) {
  var port = env.get("DBHOST");
  log.fatal(port + ' connection error--'+ error);
  process.exit(1);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  connection.close(function () {
    log.info('Mongoose default connection disconnected through app termination');
  });
});

connection.once('open', function () {
  log.info('MongoDB connected');

  health.connected = true;
  health.emit("connected");
});

mongoose.connect(env.get("DBHOST"));

module.exports = {
  health: health,
  connection: connection
};
