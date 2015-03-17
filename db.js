var env = require('./lib/environment');
var mongoose = require('mongoose');
var log = require('./lib/logger');
var idValidator = require('mongoose-id-validator');

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
    name: {
      type: String,
      required: true
    },
    sequence: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  });

  rankSchema.plugin(idValidator);

  rank = mongoose.model('Rank', rankSchema);

  /**
  * Student entity definition
  */
  studentSchema = new schema({
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    gender: { 
      type: String, 
      required: true 
    },
    rankId : {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Rank'
    },
    healthInformation: String,
    guardianInformation: String,
    email: [{
      type: String, 
      required: true
    }],
    membershipStatus: Boolean,
    membershipExpiry: Date,
    phone: { 
      type: String, 
      required: true 
    },
    birthDate: {
      type: Date,
      required: true
    }
  });

  studentSchema.plugin(idValidator);
  
  student = mongoose.model('Student', studentSchema);

  /**
  * Class entity definition
  */
  classSchema = new schema({
    class_title: {
      type: String,
      required: true
    },
    start_date : {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    day_of_week: {
      type: Number,
      required: true
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    },
    classType: String,
    RanksAllowed: [{
        type: mongoose.Schema.ObjectId, 
        ref:'Rank'
    }]
  });

  classSchema.plugin(idValidator);

  course= mongoose.model('Class', classSchema);

  /**
  * Attendance entity definition
  */
  attendanceSchema = new schema({
    student_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:'Student',
      required: true
    },
    classDate: {
      type: Date,
      required: true
    },
    classTime: {
      type: Date,
      required: true
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Class',
      required: true
    }
  });

  attendanceSchema.plugin(idValidator);

  attendance= mongoose.model('Attendance', attendanceSchema);
  // FOR MOCHA TESTING:
  // If we're running as a child process, let our parent know we're ready.
  if (process.send) {
    try {
      process.send("serverStarted");
    } catch ( e ) {
      // Exit the worker if master is gone
      process.exit(1);
    }
  }
});

mongoose.connect(env.get("DBHOST"));

module.exports = {
  "mongoose": mongoose,
  "student": mongoose.models.Student,
  "rank": mongoose.models.Rank,
  "course": mongoose.models.Course,
  "attendance": mongoose.models.Attendance,
};

