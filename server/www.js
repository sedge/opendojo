/**
 * Module dependencies.
 */
var app = require('../app');
var http = require('http');
var env = require('../lib/environment');

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