/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var expect = require('chai').expect;
var utils = require('../utils');
var env = require('../../server/lib/environment');

var jwtSetup = utils.jwtSetup;
var apiSetup = utils.apiSetup;
var initServer = utils.initServer;
var killServer = utils.killServer;

function hooks() {
  before(function(done) {
    utils.initServer(done);
  });

  after(function(done) {
    utils.killServer(done);
  });
}

var authCredentials = {
  headers: {
    username: "admin",
    password: "passW0rd"
  }
};

describe('The POST \'/email\' route', function() {
  hooks();

  this.timeout("5000");

  var validRecipients = env.get("TEST_EMAILS").split(',');

  var validEmail = {
    message: "This is a test email! Congrats.",
    recipients: validRecipients,
    subject: "test subject"
  };

  it('should return 200 when valid data, and one recipient, is passed', function(done) {debugger;
    var singleRecipient = validRecipients.slice(0, 1);
    var singleEmail = validEmail;
    singleEmail.recipients = singleRecipient;

    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      utils.apiSetup('post', '/api/email', 200, authInfo, singleEmail, done);
    });
  });

  it('should return 200 when valid data, and multiple recipients, are passed', function(done) {
    var multipleEmails = validEmail;

    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      utils.apiSetup('post', '/api/email', 200, authInfo, multipleEmails, done);
    });
  });

  it('should return 500 when a subject is missing', function(done) {
    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      var invalidEmail = validEmail;
      delete invalidEmail.subject;

      utils.apiSetup('post', '/api/email', 500, authInfo, invalidEmail, done);
    });
  });

  it('should return 500 when a subject is the wrong datatype', function(done) {
    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      var invalidEmail = validEmail;
      invalidEmail.subject = [ "foo" ];

      utils.apiSetup('post', '/api/email', 500, authInfo, invalidEmail, done);
    });
  });

  it('should return 500 when the message is missing', function(done) {
    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      var invalidEmail = validEmail;
      delete invalidEmail.message;

      utils.apiSetup('post', '/api/email', 500, authInfo, done);
    });
  });

  it('should return 500 when the message is the wrong datatype', function(done) {
    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      var invalidEmail = validEmail;
      invalidEmail.message = [ "foo" ];

      utils.apiSetup('post', '/api/email', 500, authInfo, done);
    });
  });

  it('should return 500 when the recipients are missing', function(done) {
    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      var invalidEmail = validEmail;
      delete invalidEmail.recipients;

      utils.apiSetup('post', '/api/email', 500, authInfo, done);
    });
  });

  it('should return 500 when the recipients are the wrong datatype', function(done) {
    jwtSetup(authCredentials, function(err, res, body, authInfo) {
      expect(err).to.not.exist;

      var invalidEmail = validEmail;
      invalidEmail.recipients = validRecipients[0];

      utils.apiSetup('post', '/api/email', 500, authInfo, done);
    });
  });

  it.skip('should return 401 when a valid auth token is missing', function(done) {
    done();
  });
});
