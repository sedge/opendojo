/**
 * Module dependencies.
 */
var app = require('../app');
var http = require('http');
var log = require('../lib/logger');
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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function(){
  log.info('Express running and listening on port ' + port);
});

/**
* Event listener for HTTP server "error" event.
*/
server.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.fatal(bind + ' requires elevated privileges');
      process.exit(1);
      break;
      case 'EADDRINUSE':
        log.fatal(bind + ' is already in use');
        process.exit(1);
        break;
        default:
          throw error;
        }
});

/**
 * Event listener for HTTP server "listening" event.
 */
server.on('listening', function() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  // FOR MOCHA TESTING:
  // If we're running as a child process, let our parent know we're ready.
  if (process.send) {
    try {
      process.send("serverStarted");
    } catch ( e ) {
      // exit the worker if master is gone
      process.exit(1);
    }
  }

  log.info('Listening on ' + bind);
});
