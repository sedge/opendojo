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

  rankSchema = new mongoose.Schema({
    name: String,
    sequence: Number,
    color: String
  });

  var student = mongoose.model('Student', studentSchema);
  var rank = mongoose.model('Rank', rankSchema);

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

        process.kill(process.pid, 'SIGTERM');
      });
  });

});

mongoose.connect(env.get("DBHOST"));
