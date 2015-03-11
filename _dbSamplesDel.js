var env = require('./lib/environment');
var mongoose = require('mongoose');

mongoose.connection.once('open', function(){
  var studentSchema = new mongoose.Schema ({
    firstName :String,
    lastName :String,
    gender:String,
    rankId : {type: mongoose.Schema.Types.ObjectId, ref: 'Rank'},
    healthInformation:String,
    guardianInformation:String,
    email: {type: [String]},
    membershipStatus: Boolean,
    membershipExpiry:Date,
    phone:String,
    birthDate:Date
  });

  var rankSchema = new mongoose.Schema({
    name: String,
    sequence: Number,
    color: String
  });

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

  var student = mongoose.model('Student', studentSchema);
  var rank = mongoose.model('Rank', rankSchema);
  var user = mongoose.model('User', userSchema);

  student.remove(function(err){
      if(err){
        return next(err);
      }

      console.log('All student sample data removed');

      rank.remove(function(err){
        if(err){
          return next(err);
        }

        console.log('All rank sample data removed');

        user.remove(function(err){
          console.log('All user sample data removed');

          process.exit();
        });

      });
  });

});

mongoose.connect(env.get("DBHOST"));
