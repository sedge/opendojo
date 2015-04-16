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
  var newClass;
  var newClass2;
  var ranksList=[];
  var newStud;
  var newStud2;

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

      newClass = new models.Class({
        "classTitle": "Black Belt Class",
        "dayOfWeek": 3,
        "startTime": "4" + ":" + "00" + ":" + "00",
        "endTime": "5" + ":" + "00" + ":" + "00",
        "classType": blackBelt._id,
        "RanksAllowed": ranksList
      });

      newClass2 = new models.Class({
        "classTitle": "White Belt Class",
        "dayOfWeek": 5,
        "startTime": "5" + ":" + "00" + ":" + "00",
        "endTime": "7" + ":" + "00" + ":" + "00",
        "classType": whiteBelt._id,
        "RanksAllowed": ranksList
      });

      newClass.save(function (err, newClass) {
        if(err){
          console.log("Error generating! ", err);
          return process.exit(1);
        }
        newClass2.save(function (err, newClass2) {
          if(err){
            console.log("Error generating! ", err);
            return process.exit(1);
          }
          console.log('All classes generated happily!');

          newStud = new models.Student({
            "firstName": "Damon",
            "lastName": "Salvatore",
            "gender": "M",
            "rankId": blackBelt._id,
            "healthInformation":"dead",
            "guardianInformation": "stephan",
            "email": "damon@salvatore.com",
            "membershipStatus": true,
            "membershipExpiry": "2009-04-12T20:44:55",
            "phone": "444-333-3333",
            "birthDate": "1930-04-12T20:44:55",
             "emergencyphone" : "999-888-7777"
          });
          newStud2 = new models.Student({
            "firstName": "Billy",
            "lastName": "Madison",
            "gender": "F",
            "rankId": whiteBelt._id,
            "healthInformation": "health",
            "guardianInformation": "bob",
            "email": "example@myface.com",
            "membershipStatus": false,
            "membershipExpiry": "2009-04-12T20:44:55",
            "phone": "454-323-3312",
            "birthDate": "2004-04-12T20:44:55",
            "emergencyphone" : "888-777-6666"
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

              var recordOne = new models.Attendance ({
                studentID: newStud._id,
                classDate: "2015-04-15T04:00:00.000Z",
                classTime: "4"+":"+"00"+":"+"00",
                classID: newClass._id
              });

              var recordTwo = new models.Attendance ({
                studentID: newStud2._id,
                classDate: "2015-04-17T05:00:00.000Z",
                classTime: "5"+":"+"00"+":"+"00",
                classID: newClass2._id
              });

              recordOne.save(function (err, newRecord){
                if(err){
                  console.log("Error generating! ", err);
                  return process.exit(1);
                }
                recordTwo.save(function (err, newRecord2){
                  if(err){
                    console.log("Error generating! ", err);
                    return process.exit(1);
                  }

                  console.log('All attendance records happily generated :)');
                  process.exit();
                });
              });
            });
          });
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
