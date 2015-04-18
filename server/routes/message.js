var router = require('express').Router();
var log = require('../lib/logger');
var models = require('../models')(require('../lib/db'));

var Message = models.Message;

module.exports = function() {
 
  router.route('/message')
    /* GET '/message/' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/message/' returns:
            - A status code of success/failure
            - The array of message objects with properties and values
            - There should only be one message
    */
    .get(function(req, res, next) {
      // TODO: Check for authorization: https://github.com/sedge/opendojo/issues/22

      Message.find({}, function(err, messages) {
        if (err) {
          log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        if (messages.length === 0) {
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        res.status(200).json(messages);
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
      var id;
      var messageProperties = [
        "_id","messageText"
      ];

      if (!req.body) {
        res.status(400).send('Invalid data!');
        return;
      }

      Object.keys(req.body).forEach(function(key) {
         if (messageProperties.indexOf(key) == -1) {
           validData = false;
         }
      });

      if (!validData) {
        res.status(400).send('Invalid data!');
        return;
      }

      Message.find({}, function(err, messages) {
        if (err) {
          log.error({
            err: err,
            req: req,
            res: res
          });
          return res.status(400).send('Invalid data!');
        }
        if (messages.length === 0) {
          return res.status(400).send('Invalid data!');
        }
        log.info({
          req: req,
          res: res
        });
        id = messages[0]._id;
        Message.findOneAndUpdate({"_id": id}, req.body, {new: true}, function(err, message) {
          if (err) {
            log.warn({
              req: req,
              res: res
            });
            return res.status(400).send('Invalid data!');
          }
          if (!message) {
            return res.status(400).send('Invalid data!');
          }
          log.info({
            req: req,
            res: res
          });
          res.status(200).json(message);
        });
      });
    });
      
    return router;
}();
