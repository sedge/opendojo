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
        FirstName :String,
        LastName :String,
        Gender:String,
        RankId : {type: mongoose.Schema.Types.ObjectId, ref: 'Rank'},
        HealthInformation:String,
        GuardianInformation:String, 
        Email: {type: [String]}, 
        membershipStatus: Boolean,
        membershipExpiry:Date,
        phone:String,
        BirthDate:Date
    }); 

    student = mongoose.model('Student', studentSchema);

    console.log('what is student here? ', student);

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

    //Create two Rank entities
    var blackBelt = new rank({
      "name": "Black Belt",
      "sequence": 1,
      "color": "Black"
    });
    blackBelt.save(function (err, blackBelt){
      if (err) return console.error(err);
    });

});//Populate with a couple of entities

mongoose.connect(env.get("DBHOST"));
console.log('MONGOOSE.MODELS.MYUH: ', mongoose.models.Student);
module.exports = {
  "mongoose": mongoose,
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