var expect = require('chai').expect;
var utils = require('../utils');
var env = require('../../server/lib/environment');

function hooks() {
  before(function(done) {
    utils.initServer(done);
  });

  after(function(done) {
    utils.killServer(done);
  });
}

describe('The GET \'/token\' route', function() {
  hooks();

  var options = {
    headers: {
      username: "admin",
      password: "iliketoSmokeandr1nk"
    }
  };

  var invalidHeaders = {
    headers: {
      username: "AH",
      password: "BAH"
    }
  };
debugger;
  it('should respond with a 200 and a generated token object with valid user credentials', function(done) {
    utils.jwtSetup(options, function(err, res, body) {
      expect(err).to.not.exist;

      try {
        var testBody = JSON.parse(body);

        expect(res.statusCode).to.equal(200);
        expect(testBody).to.be.a('object');
        expect(testBody).to.have.property('token');

        done();
      } catch (e) {
        expect(e, "Error parsing " + body + " as JSON.").to.not.exist;
      }
    });
  });
  it('should respond with a 401 as well as an authentication error message when the route is called with no header credentials whatsoever', function(done) {
    utils.jwtSetup({}, function(err, res, body) {
      expect(err).to.not.exist;

      expect(res.statusCode).to.equal(401);
      expect(body).to.exist;
      expect(body).to.equal('Authentication process failed');

      done();
    })
  });
  it('should respond with a 401 as well as an authentication error message when invalid credentials are passed in', function(done) {
    utils.jwtSetup(invalidHeaders, function(err, res, body) {
      expect(err).to.not.exist;

      expect(res.statusCode).to.equal(401);
      expect(body).to.exist;
      expect(body).to.equal('Authentication process failed');

      done();
    })
  });
});
