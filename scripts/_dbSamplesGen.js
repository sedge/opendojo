var db = require("../server/lib/db");
var models = require("../server/models")(db);

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
      var d = new Date();
      var ranksList=[];
      var newClass = new models.Class({
        "classTitle": "TestClass",
        "startDate": "2015-04-12T20:44:55.000Z",
        "endDate": "2015-04-12T20:44:55.000Z",
        "dayOfWeek": 3,
        "startTime": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
        "endTime": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
        "classType": blackBelt._id,
        "RanksAllowed": ranksList
      });

      var newClass2 = new models.Class({
        "classTitle": "TestClass2",
        "startDate": "2015-04-12T20:44:55.000Z",
        "endDate": "2015-04-12T20:44:55.000Z",
        "dayOfWeek": 5,
        "startTime": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
        "endTime": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
        "classType": whiteBelt._id,
        "RanksAllowed": ranksList
      });

      newClass.save(function (err, newClass) {
        if(err){
          console.log("Error generating! ", err);
          return process.exit(1);
        }
        console.log('All class generated happily!')
      });

      newClass2.save(function (err, newClass) {
        if(err){
          console.log("Error generating! ", err);
          return process.exit(1);
        }
        console.log('All class generated happily!')
      });


      var newStud = new models.Student({
        "firstName": "Damon",
        "lastName": "Salvatore",
        "gender": "M",
        "rankId": blackBelt._id,
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
        "rankId": whiteBelt._id,
        "healthInformation": "dead",
        "guardianInformation": "bob",
        "email": "example@myface.com",
        "membershipStatus": false,
        "membershipExpiry": "2009-04-12T20:44:55",
        "phone": "454-323-3312",
        "birthDate": "2004-04-12T20:44:55"
      });

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
