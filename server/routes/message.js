var router = require('express').Router();
var log = require('../lib/logger');
var models = require('../models')(require('../lib/db'));

var Message = models.Message;

module.exports = function() {
 
  //One message will continually be modified the id is "customMessage"
  router.route('/message/:id')
    /* GET '/message/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the object being requested (in JSON format ie. {"_id": "6"})

          GET '/message/:id' returns:
            - A status code of success/failure
            - The attenance object bearing the given ID and all of its associated properties and values
    */
    .get(function(req, res, next) {
      var id = req.params.id;
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      Message.findById(id, function(err, message) {
        if (err) {
          log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        if (!message)
          return res.status(400).send('Invalid data!');
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(message);
      });
    })

    /* PUT '/message/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the corresponding object to be altered (in JSON format)
            - The property being altered and its new value in the request body

          PUT '/message/:id' returns:
            - A status code of success/failure
            - If successful, the altered message data object passed in by the request
    */
    .put(function(req, res, next) {
      var validData = true;
      var messageProperties = [
        "_id","messageText"
      ];

      if (!req.body) {
        res.status(400).send('Invalid data!');
        return;
      }

      var id = req.params.id;

      Object.keys(req.body).forEach(function(key) {
         if (messageProperties.indexOf(key) == -1) {
           validData = false;
         }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      Message.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, message) {
        if (err) {
          log.warn({
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        if (!message)
          return res.status(400).send('Invalid data!');
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(message);
      });
    });

    return router;
}();
