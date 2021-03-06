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
var studentSchema;
var Student;

module.exports = function(connection) {
  // Return the cached objects if they exist
  if (Student) {
    return Student;
  }

  studentSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    rankId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rank'
    },
    healthInformation: String,
    emergencyphone : String,
    guardianInformation: String,
    email: {
      type: [String],
      required: true
    },
    membershipStatus: Boolean,
    membershipExpiry: Date,
    phone: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    }
  });

  studentSchema.plugin(idValidator);

  Student = mongoose.model('Student', studentSchema);

  return Student;
};
