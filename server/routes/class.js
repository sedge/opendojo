var router = require('express').Router();
var log = require('../lib/logger');
var models = require('../models')(require('../lib/db'));

var Class = models.Class;

module.exports = function() {
  router.route('/classes')
    /* GET '/classes' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/classes' returns:
            - A status code of success/failure
            - The entire student list via an array of JSON objects bearing every class stored in DB
    */
    .get(function(req, res, next) {
      Class.find({}, function(err, classes) {
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

      var newClass = new Class({
        classTitle: req.body.classTitle,
        dayOfWeek: req.body.dayOfWeek,
        startTime: req.body.startTime,
        endTime:req.body.endTime,
        classType: req.body.classType,
        RanksAllowed: req.body.RanksAllowed
      });

      newClass.save(function (err, newClass) {
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
        res.status(201).json(newClass);
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


      Class.findById(id, function(err, course) {
        if (err || !course) {
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
        "_id","classTitle",
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
        if (classProperties.indexOf(key) === -1) {
          validData = false;
        }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      Class.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, course) {
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
      var id = req.params.id;
      Class.remove({_id: id}, function(err) {
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
