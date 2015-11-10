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
var classSchema;
var Course;

module.exports = function(connection) {
  // Return the cached objects if they exist
  if (Course) {
    return Course;
  }

  classSchema = new mongoose.Schema({
    classTitle: {
      type: String,
      required: true
    },
    dayOfWeek: {
      type: Number,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    classType: String,
    RanksAllowed: [{
      type: mongoose.Schema.ObjectId,
      ref:'Rank'
    }]
  });

  classSchema.plugin(idValidator);

  Course = mongoose.model('Class', classSchema);

  return Course;
};
