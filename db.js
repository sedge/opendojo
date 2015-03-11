var EventEmitter = require('events').EventEmitter;

var env = require('./lib/environment');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var log = require('./lib/logger');
var idValidator = require('mongoose-id-validator');
var dbHealth = new EventEmitter();

dbHealth.connected = false;

// Variables for the schemas
var schema;
var rankSchema;
var studentSchema;
var classSchema;
var attendanceSchema;
var userSchema;

// Variables for models
var rank;
var student;
var course;
var attendance;
var user;

var connection = mongoose.connection;

connection.on('disconnected', function () {
  log.info('Mongoose default connection disconnected');
});

connection.on('error', function(error) {
  var port = env.get("DBHOST");
  log.fatal(port + ' connection error--'+ error);
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
    email: {
      type: [String], 
      required: true
    },
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

  //The mongoose-id-validator verifies that the rank ID assigned
  //to the student actually exists
  studentSchema.plugin(idValidator);
  
  student = mongoose.model('Student', studentSchema);

  /**
  * Class entity definition
  */
  classSchema = new schema({
    classTitle: {
      type: String,
      required: true
    },
    startDate : {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    dayOfWeek: {
      type: Number,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    classType: String,
    RanksAllowed: [{
      type: mongoose.Schema.ObjectId, 
      ref:'Rank'
    }]
  });

  //validates that the RanksAllowed holds actual rank Ids
  classSchema.plugin(idValidator);

  course= mongoose.model('Class', classSchema);

  /**
  * Attendance entity definition
  */
  attendanceSchema = new schema({
    studentID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:'Student',
      required: true
    },
    classDate: {
      type: Date,
      required: true
    },
    classTime: {
      type: String,
      required: true
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    }
  });

  //Validates that the classID, studentID are correct 
  attendanceSchema.plugin(idValidator);
  attendance = mongoose.model('Attendance', attendanceSchema);
  
  dbHealth.connected = true;
  dbHealth.emit("connected");

  userSchema = new schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
  });

  userSchema.pre('save', function(next){
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;

        return next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err){
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  user = mongoose.model('User', userSchema);
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

