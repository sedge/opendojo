var router = require('express').Router();
var log = require('../lib/logger');
var models = require('../models')(require('../lib/db'));

var Student = models.Student;

module.exports = function() {
  router.route('/students')
    /* GET '/students' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/students' returns:
            - A status code of success/failure
            - The entire student list via an array of JSON objects bearing every student stored in DB
    */
    .get(function(req, res, next) {
      Student.find({}, function(err, students) {
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

      var newStud = new Student({
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
          if (err.name === "ValidationError") {
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

      Student.findById(id, function(err, student) {
        if (err || !student) {
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
    .put(function(req, res, next) {debugger;
      var validData = true;
      var studentProperties = [
        "_id", "firstName", "lastName", "gender",
        "rankId", "healthInformation", "guardianInformation",
        "email",  "membershipStatus", "membershipExpiry",
        "phone", "birthDate"
      ];

      if(!req.body) {
        res.status(400).send('Invalid data!');
        return;
      }

      var id = req.params.id;

      Object.keys(req.body).forEach(function(key) {
        if(studentProperties.indexOf(key) === -1) {
          validData = false;
        }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      Student.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, student) {
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
      Student.remove({_id: id}, function(err) {
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
