var router;
var env;
var log;
var db;

module.exports = function() {
  router = require('express').Router();
  env = require('../lib/environment');
  log = require('../lib/logger');
  db = require('../db');

  router.route('/students')
    /* GET '/students' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/students' returns:
            - A status code of success/failure
            - The entire student list via an array of JSON objects bearing every student stored in DB
    */
    .get(function(req, res, next) {
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      db.mongoose.models.Student.find({}, function(err, students) {
        if(err) {
          res.status(500).send('Database Error!');
          log.error({
            err: err,
            req: req,
            res: res
          });
          return;
        }

        res.status(200).json(students);
        log.info({
          req: req,
          res: res
        });
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
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

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
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22
      // TODO: Ameliorate test logic for incoming db parse errors: https://github.com/sedge/opendojo/issues/60
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

  return router;
}();
