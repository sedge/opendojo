var expect = require('chai').expect,
  utils = require('../utils'),
  env = require('../../lib/environment');

function hooks() {
  before(function(done) {
    // Because dry runs to spin up the server sometimes take more than 2s
    this.timeout(6000);
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

  var sillyOptions = {
    headers: {
      username: "AH",
      password: "BAH"
    }
  };

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
    utils.jwtSetup(sillyOptions, function(err, res, body) {
      expect(err).to.not.exist;

      expect(res.statusCode).to.equal(401);
      expect(body).to.exist;
      expect(body).to.equal('Authentication process failed');

      done();
    })
  });
});
