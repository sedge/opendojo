var router = require('express').Router();
var nodemailer = require('nodemailer');

var env = require('../lib/environment');

var username = env.get("EMAIL_USER");
var password = env.get("EMAIL_PASS");

// Configure email module
var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: username,
    pass: password
  }
});

module.exports = function() {
  router.route('/email')
    .post(function(req, res, next) {
      if (!req.body.recipients || (req.body.recipients.length <= 0)) {
        next("At least one email address is required.");
        return;
      }

      if (!req.body.message) {
        next("A message must be submitted");
        return;
      }

      if (!req.body.subject || typeof req.body.subject !== "string") {
        next("A subject must be provided");
        return;
      }

      var emailOptions = {
        from: env.get("EMAIL_ADDRESS"),
        subject: req.body.subject,
        // This could be "html", but we must be careful to
        // prevent XSS attacks
        text: req.body.message
      };

      // Choose between `to:` and `bcc:` fields for privacy
      if (req.body.recipients.length == 1) {
        emailOptions.to = "";

        req.body.recipients.map(function(address, index, array) {
          emailOptions.to += address;
          if ((index + 1) != array.length) {
            emailOptions.to += ", ";
          }
        });
      } else {
        emailOptions.bcc = "";

        req.body.recipients.map(function(address, index, array) {
          emailOptions.bcc += address;
          if ((index + 1) != array.length) {
            emailOptions.bcc += ", ";
          }
        });
      }

      transporter.sendMail(emailOptions, function(err, info) {
        if (err) return next(err);

        res.status(200).send();
      });
    });

  return router;
}();
