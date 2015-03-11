var env = require('./lib/environment');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connection.once('open', function() {
  var userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      required: true
    }
  });

  var user = mongoose.model('User', userSchema);

  userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;

        console.log('user.password is now: ', user.password);
        return next();
      });
    });
  });

  var u1 = new user({
    username: "admin",
    password: "iliketoSmokeandr1nk"
  });

  u1.save(function(err, u1) {
    if (err) {
      console.error(err);

      return process.exit(1);
    }

    mongoose.models.User.find({}, function(err, users) {
      if (err) {
        return console.error(err);
      }

      console.log(users);

      process.exit();
    });
  });
});

mongoose.connect(env.get("DBHOST"));
