/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var env = require('../lib/environment');
var mongoose = require('mongoose');

// We cache these objects so we don't regenerate
// them if this file is required more than once
var Message;
var messageSchema;
var initialMessage;

module.exports = function(connection) {
  // Return the cached objects if they exist
  if (Message) {
    return Message;
  }

  messageSchema = new mongoose.Schema({
    messageText: {
      type: String,
      required: true
    },
  });

  Message = mongoose.model('Message', messageSchema);

  return Message;
};
