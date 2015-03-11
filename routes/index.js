var router = require('express').Router(),
    env = require('../lib/environment'),
    log = require('../lib/logger'),
    db = require('../db'),
    jwtAuth = require('./middleware/jwtAuth'),
    jwtRegen = require('./middleware/jwtRegen');

module.exports = function() {
  router.route('/students')
    /* GET '/students' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/students' returns:
            - A status code of success/failure
            - The entire student list via an array of JSON objects bearing every student stored in DB
    */
    .get(function(req, res, next) {
      db.mongoose.models.Student.find({}, function(err, students) {
        if(err) {
          return next(err);
        }

        log.info({
          req: req,
          res: res
        });

        res.status(200).json(students);
      });
    })

    /* POST '/students' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - (1) new object student with properties in accordance with data model design in JSON format

          POST '/students' returns:
            - A status code of success/failure
            - If successful, the new student object data passed in by the request
    */
    .post(function(req, res, next) {
      if(!req.body) {
        log.warn({
          req: req,
          res: res
        });
        res.status(400).send('Invalid data!');
        return;
      }
      
        var student = db.mongoose.models.Student;

        var newStud = new student({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
          rankId: req.body.rankId, 
          healthInformation: req.body.healthInformation, 
          guardianInformation: req.body.guardianInformation, 
          email: req.body.email, 
          membershipStatus: req.body.membershipStatus,
          membershipExpiry: req.body.membershipExpiry,
          phone: req.body.phone,
          birthDate: req.body.birthDate
        });
        
        newStud.save(function (err, newStud) {
          if (err) {
            log.error({
              err: err,
              req: req,
              res: res
            });
            if (err.name ==="ValidationError") {
               res.status(400).send('Invalid data!');
               return;
            }
            return next(err);
          }
          res.status(201).json(newStud);
        });
  });

  router.route('/student/:id')
    /* GET '/student/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the object being requested (in JSON format ie. {"_id": "6"})

          GET '/student/:id' returns:
            - A status code of success/failure
            - The student object bearing the given ID and all of its associated properties and values
    */
    .get(function(req, res, next) {
      var id = req.params.id;

      db.mongoose.models.Student.findById(id, function(err, student) {
        if (err) {
        log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(student);
      });
    })

    /* PUT '/student/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the corresponding object to be altered (in JSON format)
            - The property being altered and its new value in the request body

          PUT '/student/:id' returns:
            - A status code of success/failure
            - If successful, the altered student data object passed in by the request
    */
    .put(function(req, res, next) {
      var validData = true;
      var studentProperties = [
      "_id","firstName","lastName","gender",
      "rankId","healthInformation","guardianInformation", 
      "email", "membershipStatus","membershipExpiry",
      "phone","birthDate" 
      ]; 
     
      if(!req.body) {
        res.status(400).send('Invalid data!');
        return;
      }
      
      var id = req.params.id;

      Object.keys(req.body).forEach(function(key) { 
       if(studentProperties.indexOf(key)==-1) {
        validData = false;
       }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      db.mongoose.models.Student.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, student) {
        if (err && err.name === "CastError") {      
          log.warn({
            req: req,
            res: res
          });
           return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(student);
      });
    })

    /* DELETE '/student/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The student ID of the corresponding object to be deleted

          DELETE '/student/:id' returns:
            - A status code of success/failure
    */
    .delete(function(req, res, next) {
      var id = req.params.id;
      db.mongoose.models.Student.remove({_id: id}, function(err) {
        if(err) {
          log.error({
            req: req,
            res: res,
            err: err
          });
          return res.status(204).send('Operation completed');
        }
        log.info({
          req: req,
          res: res
        });
        return res.status(204).send('Operation completed');
      });
    });

  /* GET '/ranks' accepts:
          - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

        GET '/ranks' returns:
          - A status code of success/failure
          - All rank objects in the database
  */
  router.route('/ranks')
    .get(function(req, res, next) {
      db.mongoose.models.Rank.find({}, function(err, ranks) {
        if(err) {
          res.status(500).send('Database Error!');
          log.error({
            err: err,
            req: req,
            res: res
          });
          return;
        }

        res.status(200).json(ranks);
        log.info({
          req: req,
          res: res
        });
      });
    })
  
    .post(function(req, res, next) {
      if(!req.body) {
        log.warn({
          req: req,
          res: res
        });
        res.status(400).send('Invalid data!');
        return;
      }
      
      var rank = db.mongoose.models.Rank;

      var newRank = new rank({
        name: req.body.name,
        sequence: req.body.sequence,
        color: req.body.color
      });
      
      newRank.save(function (err, newRank) {
        if (err) {
          if (err.name === "ValidationError") {
            log.error({
              err: err,
              req: req,
              res: res
            });
            return res.status(400).send('Invalid data!');
          }
          return next(err);
        }
        res.status(201).json(newRank);
      });
   });

  router.route('/rank/:id')
    /* GET '/rank/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the object being requested (in JSON format ie. {"_id": "6"})

          GET '/rank/:id' returns:
            - A status code of success/failure
            - The rank object bearing the given ID and all of its associated properties and values
    */
    .get(function(req, res, next) {
      var id = req.params.id;
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      db.mongoose.models.Rank.findById(id, function(err, rank) {
        if (err) {
          log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(rank);
      });
    })

    /* PUT '/rank/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the corresponding object to be altered (in JSON format)
            - The property being altered and its new value in the request body

          PUT '/rank/:id' returns:
            - A status code of success/failure
            - If successful, the altered rank data object passed in by the request
    */
    .put(function(req, res, next) {
      var validData = true;
      var rankProperties = [
       "_id","name","sequence","color"
      ]; 
     
      if(!req.body) {
        res.status(400).send('Invalid data!');
        return;
      }
      
      var id = req.params.id;

      Object.keys(req.body).forEach(function(key) { 
       if (rankProperties.indexOf(key) == -1) {
        validData = false;
       }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      db.mongoose.models.Rank.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, rank) {
        if (err) {   
          log.warn({
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(rank);
      });
    })

    /* DELETE '/rank/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The rank ID of the corresponding object to be deleted

          DELETE '/rank/:id' returns:
            - A status code of success/failure
    */
    .delete(function(req, res, next) {
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22
       
      var id = req.params.id;
      db.mongoose.models.Rank.remove({_id: id}, function(err) {
        if(err) {
          log.error({
            req: req,
            res: res,
            err: err
          });
          return res.status(204).send('Operation completed');
        }
        log.info({
          req: req,
          res: res
        });
        return res.status(204).send('Operation completed');
      });
    });

  router.route('/classes')
    /* GET '/classes' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/classes' returns:
            - A status code of success/failure
            - The entire student list via an array of JSON objects bearing every class stored in DB
    */
    .get(function(req, res, next) {

      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      db.mongoose.models.Class.find({}, function(err, classes) {
        if(err) {
          res.status(500).send('Database Error!');
          log.error({
            err: err,
            req: req,
            res: res
          });
          return;
        }

        res.status(200).json(classes);
        log.info({
          req: req,
          res: res
        });
      });
    })

    /* POST '/classes' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - (1) new object class with properties in accordance with data model design in JSON format

          POST '/classes' returns:
            - A status code of success/failure
            - If successful, the new class object data passed in by the request
    */
    .post(function(req, res, next) {
      if(!req.body) {
        log.warn({
          req: req,
          res: res
        });
        res.status(400).send('Invalid data!');
        return;
      }
      
      var course = db.mongoose.models.Class;

      var newCourse = new course({
        classTitle: req.body.classTitle,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        dayOfWeek: req.body.dayOfWeek, 
        startTime: req.body.startTime,
        endTime:req.body.endTime, 
        classType: req.body.classType, 
        RanksAllowed: req.body.RanksAllowed
      });

      newCourse.save(function (err, newCourse) {
        if (err) {          
          if (err.name === "ValidationError") {
            log.error({
              err: err,
              req: req,
              res: res
            });
            return res.status(400).send('Invalid data!');
          }
          return next(err);
        }
        res.status(201).json(newCourse);
      });
    });

  router.route('/class/:id')
    /* GET '/class/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the object being requested (in JSON format ie. {"_id": "6"})

          GET '/class/:id' returns:
            - A status code of success/failure
            - The class object bearing the given ID and all of its associated properties and values
    */
    .get(function(req, res, next) {
      var id = req.params.id;

      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      db.mongoose.models.Class.findById(id, function(err, course) {
        if (err) {
          log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(course);
      });
    })

    /* PUT '/class/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the corresponding object to be altered (in JSON format)
            - The property being altered and its new value in the request body

          PUT '/class/:id' returns:
            - A status code of success/failure
            - If successful, the altered class data object passed in by the request
    */
    .put(function(req, res, next) {
      var validData = true;
      var classProperties = [
        "_id","classTitle","startDate","endDate",
        "dayOfWeek","startTime","endTime", 
        "classType", "RanksAllowed"
      ]; 
     
      if(!req.body) {
        log.warn({
          req: req,
          res: res
        });
        res.status(400).send('Invalid data!');
        return;
      }
      
      var id = req.params.id;

      Object.keys(req.body).forEach(function(key) { 
        if (classProperties.indexOf(key) ==-1) {
          validData = false;
        }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      db.mongoose.models.Class.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, course) {
        if (err && err.name === "CastError") {      
          log.warn({
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(course);
      });
    })

    /* DELETE '/class/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The class ID of the corresponding object to be deleted

          DELETE '/class/:id' returns:
            - A status code of success/failure
    */
    .delete(function(req, res, next) {
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22
       
      var id = req.params.id;
      db.mongoose.models.Class.remove({_id: id}, function(err) {
        if(err) {
          log.error({
            req: req,
            res: res,
            err: err
          });
          return res.status(204).send('Operation completed');
        }
        log.info({
          req: req,
          res: res
        });
        return res.status(204).send('Operation completed');
      });
    });

  router.route('/records')
    /* GET '/records' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/records' returns:
            - A status code of success/failure
            - All attendance objects in the database
    */
    .get(function(req, res, next) {
      db.mongoose.models.Attendance.find({}, function(err, records) {
        if(err) {
          res.status(500).send('Database Error!');
          log.error({
            err: err,
            req: req,
            res: res
          });
          return;
        }

        res.status(200).json(records);
        log.info({
          req: req,
          res: res
        });
      });
    })
  
    .post(function(req, res, next) {
      if(!req.body) {
        log.warn({
          req: req,
          res: res
        });
        res.status(400).send('Invalid data!');
        return;
      }
      
      var attendance = db.mongoose.models.Attendance;

      var newAttendance = new attendance({
        studentID: req.body.studentID,
        classDate: req.body.classDate,
        classTime: req.body.classTime,
        classID: req.body.classID
      });
      
      newAttendance.save(function (err, newAttendance) {
        if (err) {
          if (err.name === "ValidationError") {
            log.error({
              err: err,
              req: req,
              res: res
            });
            return res.status(400).send('Invalid data!');
          }
          return next(err);
        }
        res.status(201).json(newAttendance);
      });
   });

  router.route('/record/:id')
    /* GET '/record/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the object being requested (in JSON format ie. {"_id": "6"})

          GET '/record/:id' returns:
            - A status code of success/failure
            - The attenance object bearing the given ID and all of its associated properties and values
    */
    .get(function(req, res, next) {
      var id = req.params.id;
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      db.mongoose.models.Attendance.findById(id, function(err, record) {
        if (err) {
          log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(record);
      });
    })

    /* PUT '/record/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the corresponding object to be altered (in JSON format)
            - The property being altered and its new value in the request body

          PUT '/record/:id' returns:
            - A status code of success/failure
            - If successful, the altered attendance data object passed in by the request
    */
    .put(function(req, res, next) {
      var validData = true;
      var attendanceProperties = [
        "_id","studentID","classDate","classTime", "classID"
      ]; 
     
      if (!req.body) {
        res.status(400).send('Invalid data!');
        return;
      }
      
      var id = req.params.id;

      Object.keys(req.body).forEach(function(key) { 
         if (attendanceProperties.indexOf(key) == -1) {
           validData = false;
         }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      db.mongoose.models.Attendance.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, record) {
        if (err) {   
          log.warn({
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(record);
      });
    })

    /* DELETE '/record/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The rank ID of the corresponding object to be deleted

          DELETE '/record/:id' returns:
            - A status code of success/failure
    */
    .delete(function(req, res, next) {
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22
       
      var id = req.params.id;
      db.mongoose.models.Attendance.remove({_id: id}, function(err) {
        if(err) {
          log.error({
            req: req,
            res: res,
            err: err
          });
          return res.status(204).send('Operation completed');
        }
        log.info({
          req: req,
          res: res
        });
        return res.status(204).send('Operation completed');
      });
    });

    return router;
}();
