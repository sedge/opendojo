var router = require('express').Router();
var log = require('../lib/logger');
var models = require('../models')(require('../lib/db'));

var Attendance = models.Attendance;

module.exports = function() {
  router.route('/records')
    /* GET '/records' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/records' returns:
            - A status code of success/failure
            - All attendance objects in the database
    */
    .get(function(req, res, next) {
      Attendance.find({}, function(err, records) {
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

      var newAttendance = new Attendance({
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

      Attendance.findById(id, function(err, record) {
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

      Attendance.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, record) {
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
      Attendance.remove({_id: id}, function(err) {
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
