/**
 * Add any new test files to the list in order to
 * get them running by default.
 */

// Host API
require('./api/host');

// Student API
require('./api/student');

// Rank API
require('./api/rank');

// Attendance API
require('./api/attendance');

// Class API
require('./api/course.js')

// Auth API
require('./api/auth');


/**
 * The email API tests require sensitive information.
 * They must only be run with a local .env file and not
 * on deployment services like `travis-ci`.
 */

// Email API
// require('./api/email');