var router = require('express').Router();
var nodemailer = require('nodemailer');
var sanitizer = require('sanitize-html');

var env = require('../lib/environment');

var emailOpts = env.get("EMAIL") || {
  port: 1234,
  host: 'abc123',
  secure: true,
  user: 'foo',
  pass: 'foo'
};

// Configure email module
var transporter = nodemailer.createTransport({
  port: emailOpts.port,
  host: emailOpts.host,
  secure: emailOpts.secure,
  authMethod: "LOGIN",
  auth: {
    user: emailOpts.user,
    pass: emailOpts.pass
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
        html: sanitizer(req.body.message)
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
