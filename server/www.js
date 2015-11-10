/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

/**
 * Module dependencies.
 */
var app = require('./app');
var http = require('http');
var env = require('./lib/environment');

/**
 * Get port from environment and store in Express.
 */
var port = env.get('PORT') || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

module.exports = {
  server: server,
  port: port
};