module.exports = function() {
  var router = require('express').Router();

  router.route('/students')
    .get(function(req, res, next) {
      /* GET '/students' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim

          GET '/students' returns:
            - A status code of success/failure
            - The entire student list via an array of JSON objects bearing every student stored in DB
      */

      res.status(500).send("Not yet implemented...");
    })
    .post(function(req, res, next) {
      /* POST '/students' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - (1) new object student with properties in accordance with data model design in JSON format

          POST '/students' returns:
            - A status code of success/failure
            - If successful, the new student object data passed in by the request
      */

      res.status(500).send("Not yet implemented...");
  });

  router.route('/student/:id')
    .get(function(req, res, next) {
      /* GET '/student/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the object being requested (in JSON format ie. {"student_id": "6"})

          GET '/student/:id' returns:
            - A status code of success/failure
            - The student object bearing the given ID and all of its associated properties and values
      */

      res.status(500).send("Not yet implemented...");
    })
    .put(function(req, res, next) {
      /* PUT '/student/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The ID of the corresponding object to be altered (in JSON format)
            - The property being altered and its new value in the request body

          PUT '/student/:id' returns:
            - A status code of success/failure
            - If successful, the altered student data object passed in by the request
      */

      res.status(500).send("Not yet implemented...");
    })
    .delete(function(req, res, next) {
      /* DELETE '/student/:id' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The student ID of the corresponding object to be deleted

          DELETE '/student/:id' returns:
            - A status code of success/failure
      */

      res.status(500).send("Not yet implemented...");
  });

  router.get('/students/rank/:colour', function(req, res, next) {
      /* GET '/students/rank/:colour' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The rank of the student objects specified by the route value (ie. "1" || "blue")

          GET '/students/rank/:colour' returns:
            - A status code of success/failure
            - All student objects bearing the given rank values
      */

      res.status(500).send("Not yet implemented...");
  });

  router.get('/students/member/:status', function(req, res, next) {
      /* GET '/students/member/:status' accepts:
            - Auth/Session tokens required from successful user sign-in to check for appropriate role/claim
            - The status value of the objects being passed in the route (ie. "true" || "false")

          GET '/students/member/:status' returns:
            - A status code of success/failure
            - All student objects bearing the specified status
      */

      res.status(500).send("Not yet implemented...");
  });

  return router;
}();
