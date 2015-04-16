var expect = require('chai').expect;
var utils = require('../utils');

var options = {
    headers: {
        username: "admin",
        password: "iliketoSmokeandr1nk"
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

describe('The GET \'/api/message/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the corresponding message object when invoked with proper credentials, and customMessage as id', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/message/' + 'customMessage', 200, authInfo, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        Object.keys(body).forEach(function(prop) {
          if (prop === "__v") {
            return;
          }
          if (prop === "_id") {
            expect(body).to.have.property('_id').equal('customMessage');
            return;
          }
          expect(body).to.have.property(prop).deep.equal("Please enter your text");
          done();
        });
      });
    });
  });

  it('should return a 404 status code when invoked without providing an id', function(done) {

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('get', '/api/message/' + '', 404, authInfo, done);
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/message/' + 'fey', 400, authInfo, function(err, res, body) {
        expect(body).to.equal('Invalid data!');
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

describe('The PUT \'/api/message/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the modified message object when invoked with proper credentials, and valid data', function(done) {

    var modMessage = {
      messageText: "This is my new message"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('put', '/api/message/' + 'customMessage', 200, authInfo, modMessage, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.have.property('messageText').equal('This is my new message');
        done();
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
      var newMessage = {
        messageText: "Crimson"
      };

      utils.jwtSetup(options, function(err, res, body, authInfo) {
        utils.apiSetup('put', '/api/message/' + 'abc', 400, authInfo, newMessage, function(err, res, body) {
          expect(body).to.equal('Invalid data!');
          done();
        });
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newMessage = {
      catName:"Einstein"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('put', '/api/message/' + 'customMessage', 400, authInfo, newMessage, function(err, res, body) {
        expect(body).to.equal('Invalid data!');
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    var newMessage = {
      messageText: "Cauliflower"
    };

    utils.apiSetup('put', '/api/message/' + 'customMessage', 401, invalidHeaders, newMessage, done);
  });
});
