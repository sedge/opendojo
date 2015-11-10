/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var env = require('../lib/environment');
var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');

// We cache these objects so we don't regenerate
// them if this file is required more than once
var Attendance;
var attendanceSchema;

module.exports = function(connection) {
  // Return the cached objects if they exist
  if (Attendance) {
    return Attendance;
  }

  attendanceSchema = new mongoose.Schema({
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    classDate: {
      type: Date,
      required: true
    },
    classTime: {
      type: String,
      required: true
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    }
  });

  attendanceSchema.plugin(idValidator);

  Attendance = mongoose.model('Attendance', attendanceSchema);

  return Attendance;
};
