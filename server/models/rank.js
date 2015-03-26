var env = require('../lib/environment');
var mongoose = require('mongoose');

// We cache these objects so we don't regenerate
// them if this file is required more than once
var rankSchema;
var Rank;

module.exports = function(connection) {
  // Return the cached objects if they exist
  if (Rank) {
    return Rank;
  }

  rankSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    sequence: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  });

  Rank = mongoose.model('Rank', rankSchema);

  return Rank;
};
