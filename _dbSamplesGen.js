var env = require('./lib/environment');
var mongoose = require('mongoose');

mongoose.connection.once('open', function(){
  var studentSchema = new mongoose.Schema ({
    firstName: String,
    lastName: String,
    gender:String,
    rankId : {type: mongoose.Schema.Types.ObjectId, ref: 'Rank'},
    healthInformation: String,
    guardianInformation: String,
    email: {type: [String]},
    membershipStatus: Boolean,
    membershipExpiry: Date,
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

  var blackBelt = new rank({
    "name": "Black Belt",
    "sequence": 2,
    "color": "Black"
  });

  var whiteBelt = new rank({
    "name": "White Belt",
    "sequence": 1,
    "color": "White"
  });

  var newStud = new student({
    "firstName": "Damon",
    "lastName": "Salvatore",
    "gender": "M",
     "rankId": "54da74e15fac9fec3c848fab",
     "healthInformation":"healthy",
    "guardianInformation": "stephan",
     "email": "damon@salvatore.com",
    "membershipStatus": true,
    "membershipExpiry": "2009-04-12T20:44:55",
    "phone": "444-333-3333",
    "birthDate": "2009-04-12T20:44:55"
  });

  var newStud2 = new student({
    "firstName": "Billy",
    "lastName": "Madison",
    "gender": "F",
     "rankId": "54da74e15fac9fec3c848fab",
     "healthInformation": "dead",
    "guardianInformation": "bob",
     "email": "example@myface.com",
    "membershipStatus": false,
    "membershipExpiry": "2009-04-12T20:44:55",
    "phone": "454-323-3312",
    "birthDate": "2004-04-12T20:44:55"
  });
  blackBelt.save(function (err, blackBelt){
    if (err) {
      return console.error(err);
    }

    whiteBelt.save(function (err, whiteBelt){
      if (err) {
        return console.error(err);
      }

      console.log('All ranks happily generated!');

      newStud.save(function (err, newStud) {
        if (err) {
          return console.log(err);
        };

        newStud2.save(function (err, newStud2) {
          if (err) {
            return console.log(err);
          };

          console.log('All students generated happily!')

          process.kill(process.pid, 'SIGTERM');
        });
      });
    });
  });
});

mongoose.connect(env.get("DBHOST"));
