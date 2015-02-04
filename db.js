var env = require('./lib/environment');
var mongoose = require('mongoose');

//Variables for the schemas
var schema; 
var rankSchema;
var rank; 
var studentSchema; 
var student;
var classSchema;
var course;
var attendanceSchema;
var attendance;
var db;

//Variable for connection condition
var health = {
  connected: false,
  err: null
};

//Create connection
db = mongoose.connection;

//On disconnect
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
    health.connected = false;       
});

db.on('disconnecting', function() {
    rank.remove({}, function(err){
      if(err){
        return "Error";
      }else{
        console.log("rank removed");
      }
    });

    student.remove({}, function(err){
      if(err){
        return "Error";
      }else{
        console.log("student removed");
      }
    });
});

//On error
db.on('error', function(error) {
    health.connected =  false;
    health.err = error;
    console.log('Mongoose default connection error: '+error);
});
//db.on('error', console.error.bind(console, 'connection error:'));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


db.once('open', function (callback) {
    health.connected = true;
    console.log("connected");
     //Presumably connected
     schema = mongoose.Schema;
    
    //Rank entity
    rankSchema = new schema({
        name: String,
        sequence: Number,
        color: String
    });

    rank = mongoose.model('Rank', rankSchema);

    //Student entity
    studentSchema = new schema({
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

    student = mongoose.model('Student', studentSchema);

    //Class entity
    classSchema = new schema({
        class_title: String,
        start_date : Date,
        end_date: Date,
        day_of_week: Number,
        start_time: Date,
        end_time: Date,
        classType: String, 
        RanksAllowed: {type: [mongoose.Schema.ObjectId], ref:'Rank'}
    });

    course= mongoose.model('Class', classSchema);

    //Attendance entity
    attendanceSchema = new schema({
        student_id: {type: mongoose.Schema.Types.ObjectId, ref:'Student'},
        classDate: Date,
        classTime: Date,
        classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
    });

    attendance= mongoose.model('Attendance', attendanceSchema);

    var blackBelt = new rank({
      "name": "Black Belt",
      "sequence": 2,
      "color": "Black"
    });

    blackBelt.save(function (err, blackBelt){
      if (err) return console.error(err);
    });

    var whiteBelt = new rank({
      "name": "White Belt",
      "sequence": 1,
      "color": "White"
    });

    whiteBelt.save(function (err, whiteBelt){
      if (err) return console.error(err);
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

    newStud.save(function (err, newStud) {
      if (err) { 
        return console.log(err);
      };
    });

    var newStud2 = new student({
          "firstName": "Billy",
          "lastName": "Madison",
          "gender": "F",
           "rankId": "54da74e15fac9fec3c848fab",
           "healthInformation":"dead",
          "guardianInformation": "bob", 
           "email": "example@myface.com", 
          "membershipStatus": false,
          "membershipExpiry": "2009-04-12T20:44:55",
          "phone": "454-323-3312",
          "birthDate": "2004-04-12T20:44:55"
        });

    newStud2.save(function (err, newStud2) {
      if (err) { 
        return console.log(err);
      };
    });
});//Populate with a couple of entities

mongoose.connect(env.get("DBHOST"));

module.exports = {
  "mongoose": mongoose,
  "studentSchema": studentSchema,
  "student": mongoose.models.Student,
  "rank": mongoose.models.Rank,
  "course": mongoose.models.Course,
  "attendance": mongoose.models.Attendance,
  "healthCheck": function (req, res, next){
      if (health.connected)
      {
        next();
      }
      else{
         next( new Error( "MongoDB: No connection found!" ) );
      }
  }
};
//methods that I need
/*Student
createStudent() done
updateStudent() done
getAllStudents() done
getStudentById(id) done
getStudentByName(name) done
getStudentsByRank(rank) done
getStudentsByGender(gender) done
getStudentsByStatus(status) done
addClass()
updateClass()
getAllClasses()
getClassById(id)
getClassByName(name)
getClassesByDate(date)
createAttendanceRecord()
getAttendingStudentsByName(name)
getAttendingStudentsByRank(rank)
getAttendingStudentsByGender(gender)
getAttendingStudentsByDate(date)
getAttendingStudentsByClass(class)*/