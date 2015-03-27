var router = require('express').Router();
var log = require('../lib/logger');
var models = require('../models')(require('../lib/db'));

var Rank = models.Rank;

module.exports = function() {
  router.route('/ranks')
    .get(function(req, res, next) {
      Rank.find({}, function(err, ranks) {
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

      var newRank = new Rank({
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

      Rank.findById(id, function(err, rank) {
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

      Rank.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, rank) {
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
      Rank.remove({_id: id}, function(err) {
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
