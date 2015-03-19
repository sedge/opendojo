var EventEmitter = require('events').EventEmitter;

var env = require('./lib/environment');
var mongoose = require('mongoose');
var log = require('./lib/logger');
var dbHealth = new EventEmitter();

dbHealth.connected = false;

// Variables for the schemas
var schema;
var rankSchema;
var studentSchema;
var classSchema;
var attendanceSchema;

// Variables for models
var rank;
var student;
var course;
var attendance;

var connection = mongoose.connection;

connection.on('disconnected', function () {
    log.info('Mongoose default connection disconnected');
});

connection.on('error', function(error) {
    var port = env.get("DBHOST");
    log.fatal(port + ' connection error--'+error);
    process.exit(1);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  connection.close(function () {
    log.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

connection.once('open', function (callback) {
  log.info('connected');
  schema = mongoose.Schema;

  /**
  * Rank entity definition
  */
  rankSchema = new schema({
    name: String,
    sequence: Number,
    color: String
  });

  rank = mongoose.model('Rank', rankSchema);

  /**
  * Student entity definition
  */
  studentSchema = new schema({
    firstName: String,
    lastName: String,
    gender: String,
    rankId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rank'
    },
    healthInformation: String,
    guardianInformation: String,
    email: {
      type: [String]
    },
    membershipStatus: Boolean,
    membershipExpiry: Date,
    phone: String,
    birthDate: Date
  });

  student = mongoose.model('Student', studentSchema);

  /**
  * Class entity definition
  */
  classSchema = new schema({
    class_title: String,
    start_date : Date,
    end_date: Date,
    day_of_week: Number,
    start_time: Date,
    end_time: Date,
    classType: String,
    RanksAllowed: {
      type: [mongoose.Schema.ObjectId],
      ref:'Rank'
    }
  });

  course= mongoose.model('Class', classSchema);

  /**
  * Attendance entity definition
  */
  attendanceSchema = new schema({
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Student'
    },
    classDate: Date,
    classTime: Date,
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }
  });

  attendance = mongoose.model('Attendance', attendanceSchema);

  dbHealth.connected = true;
  dbHealth.emit("connected");
});

mongoose.connect(env.get("DBHOST"));

module.exports = {
  "mongoose": mongoose,
  "student": mongoose.models.Student,
  "rank": mongoose.models.Rank,
  "course": mongoose.models.Course,
  "attendance": mongoose.models.Attendance,
  dbHealth: dbHealth
};

