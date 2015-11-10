/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var expect = require('chai').expect;
var utils = require('../utils');

var options = {
    headers: {
        username: "admin",
        password: "passW0rd"
    }
};

var invalidHeaders = {
    headers: {
        username: "KOOLAID",
        password: "COWBOY"
    }
};

function hooks() {
  before(function(done) {
    utils.initServer(done);
  });

  after(function(done) {
    utils.killServer(done);
  });
}

describe('The GET \'/api/message/\' route', function() {
  hooks();

  it('should return a 200 status code and the corresponding message object when invoked with proper credentials, and customMessage as id', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/message', 200, authInfo, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.be.an('array');
        done();
      });
    });
  });
  
  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('get', '/api/message' + "sh0uldntmatt3r", 401, invalidHeaders, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid no user credentials whatsoever', function(done) {
    utils.apiSetup('get', '/api/message' + "st1llsh0uldntmatt3r", 401, {}, done);
  });
});

describe('The PUT \'/api/message/\' route', function() {
  hooks();

  it('should return a 200 status code and the modified message object when invoked with proper credentials, and valid data', function(done) {

    var modMessage = {
      messageText: "This is my new message"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('put', '/api/message/', 200, authInfo, modMessage, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.have.property('messageText').equal('This is my new message');
        done();
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newMessage = {
      catName:"Einstein"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('put', '/api/message/', 400, authInfo, newMessage, function(err, res, body) {
        expect(body).to.equal('Invalid data!');
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    var newMessage = {
      messageText: "Cauliflower"
    };

    utils.apiSetup('put', '/api/message/', 401, invalidHeaders, newMessage, done);
  });
});
