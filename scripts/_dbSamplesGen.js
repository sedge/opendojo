var db = require("../server/lib/db");
var models = require("../server/models");

function _generateSampleData() {
  var blackBelt = new models.Rank({
    "name": "Black Belt",
    "sequence": 2,
    "color": "Black"
  });

  var whiteBelt = new models.Rank({
    "name": "White Belt",
    "sequence": 1,
    "color": "White"
  });

  var newStud = new models.Student({
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

  var newStud2 = new models.Student({
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
    if(err){
      console.log("Error generating! ", err);
      return process.exit(1);
    }

    whiteBelt.save(function (err, whiteBelt){
      if(err){
        console.log("Error generating! ", err);
        return process.exit(1);
      }

      console.log('All ranks happily generated!');
      newStud.save(function (err, newStud) {
        if(err){
          console.log("Error generating! ", err);
          return process.exit(1);
        }

        newStud2.save(function (err, newStud2) {
          if(err){
            console.log("Error generating! ", err);
            return process.exit(1);
          }

          console.log('All students generated happily!')
          process.exit();
        });
      });
    });
  });
}

if (db.health.connected) {
  _generateSampleData();
} else {
  db.health.once("connected", function() {
    _generateSampleData();
  });
}
