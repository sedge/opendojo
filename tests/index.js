/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

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

// Custom message API
require('./api/message')
