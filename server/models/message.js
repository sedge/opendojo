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
