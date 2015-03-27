var env = require('../lib/environment');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// We cache these objects so we don't regenerate
// them if this file is required more than once
var userSchema;
var User;

module.exports = function(connection) {
  // Return the cached objects if they exist
  if (User) {
    return User;
  }

  userSchema = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
  });

  userSchema.pre('save', function(next){
    var User = this;

    // Only hash the password if it has been modified (or is new)
    if (!User.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(function(err, salt) {
      if (err) return next(err);

      // Hash the password along with our new salt
      bcrypt.hash(User.password, salt, function(err, hash) {
        if (err) return next(err);

        // Override the cleartext password with the hashed one
        User.password = hash;

        next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err){
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  User = mongoose.model('User', userSchema);

  return User;
};
