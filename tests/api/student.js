var expect = require('chai').expect;
var utils = require('../utils');
var env = require('../../server/lib/environment');
var newStud;
var rankId = "";

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
    utils.initServer(function() {
      addRanks(function() {
        createStudentObject(done);
      });
    });
  });

  after(function(done) {
    deleteRanks(function() {
      utils.killServer(done);
    });
  });
}

function createStudentObject(callback) {
  var emailArr = ["testemail@email.com"];
  newStud = {
    firstName: "TestFName",
    lastName: "TestLName",
    gender: "F",
    rankId: rankId,
    healthInformation: "functioning within established parameters",
    guardianInformation: "guardian angel",
    email: emailArr, //this is an array and should be passed in as such on the client request
    membershipStatus: true,
    membershipExpiry: "2015-04-12T20:44:55.000Z",
    phone: "111-222-3333",
    birthDate: "2004-04-12T20:44:55.000Z"
  };
  callback();
}

function addRanks(callback) {
  var newRank = {
    name: "Black",
    sequence: 1,
    color: "black"
  };

  utils.jwtSetup(options, function(err, res, body, authInfo) {
    utils.apiSetup('post', '/api/ranks', 201, authInfo, newRank, function(err, res, body) {
      rankId = body._id;
      callback();
    });
  });

}

function deleteRanks(callback) {
  if (rankId == "") {
    return callback();
  }

  utils.jwtSetup(options, function(err, res, body, authInfo) {
    utils.apiSetup('delete', '/api/rank/' + rankId, 204, authInfo, function(err, res, body) {
      rankId = "";
      return callback();
    });
  });
}

//Before the scripts are run the _dbSamplesGen should be ran to generate rank ids
describe('The GET \'/api/students\' route', function() {
  hooks();

  it('should return a 200 status code and all the students when invoked with proper credentials', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/students', 201, authInfo, newStud, function(err, res, body) {
        expect(err).to.not.exist;

        expect(body).to.exist;
        Object.keys(body).forEach(function(prop) {
          if (prop === "__v") {
            return;
          }
          if (prop === "_id") {
            expect(body).property('_id').to.exist;

            return;
          }

          expect(body).to.have.property(prop).deep.equal(newStud[prop]);
        });

        utils.apiSetup('get', '/api/students', 200, authInfo, function(err, res, body) {
          expect(err).to.not.exist

          expect(body).to.exist;
          expect(body).to.be.an('array');

          done();
        });
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('get', '/api/students', 401, invalidHeaders, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with no user credentials whatsoever', function(done) {
    utils.apiSetup('get', '/api/students', 401, {}, done);
  });
});

describe('The POST \'/api/students/\' route', function() {
  hooks();

  it('should return a 201 status code, along with the newly created student object when invoked using proper input data and credentials', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/students', 201, authInfo, newStud, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        Object.keys(body).forEach(function(prop) {
          if (prop === "__v") {
            return;
          }
          if (prop === "_id") {
            expect(body).property('_id').to.exist;
            return;
          }
          expect(body).to.have.property(prop).deep.equal(newStud[prop]);
        });

        utils.apiSetup('delete', '/api/student/' + body._id, 204, authInfo, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newStud = {
      catName: "Ginger"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/students', 400, authInfo, newStud, done);
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('post', '/api/students', 401, invalidHeaders, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with no user credentials whatsoever', function(done) {
    utils.apiSetup('post', '/api/students', 401, {}, done);
  });
});

describe('The GET \'/api/student/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the corresponding student object when invoked with proper credentials, and a valid id string', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/students', 201, authInfo, newStud, function(err, res, body) {
        expect(err).to.not.exist;

        expect(body).to.exist;
        id = body._id;

        utils.apiSetup('get', '/api/student/' + id, 200, authInfo, function(err, res, body) {
          expect(err).to.not.exist;
          expect(body).to.exist;
          Object.keys(body).forEach(function(prop) {
            if (prop === "__v") {
              return;
            }
            if (prop === "_id") {
              expect(body).to.have.property('_id').equal(id);
              return;
            }
            expect(body).to.have.property(prop).deep.equal(newStud[prop]);
          });
          utils.apiSetup('delete', '/api/student/' + id, 204, authInfo, function(err, res, body) {
            expect(err).to.not.exist;

            utils.apiSetup('get', '/api/student/' + id, 400, authInfo, function(err, res, body) {
              expect(err).to.not.exist;
              expect(body).to.equal('Invalid data!');

              done();
            });
          });
        });
      });
    });
  });

  it('should return a 404 status code and a custom \'bad request\' error message when invoked without providing an id', function(done) {
    id = "";

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/student/' + id, 404, authInfo, function(err, res, body) {
        done();
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not a number', function(done) {
    id = "abc";

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/student/' + id, 400, authInfo, function(err, res, body) {
        expect(body).to.equal('Invalid data!');

        done();
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is a number but not found', function(done) {
    id = "abc";

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/student/' + id, 400, authInfo, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.equal('Invalid data!');

        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('get', '/api/student/' + id, 401, invalidHeaders, done);
  });
  it('should return a 401 status code and a default \'unauthorized\' error when invoked with no user credentials whatsoever', function(done) {
    utils.apiSetup('get', '/api/student/' + id, 401, {}, done);
  });
});

describe('The PUT \'/api/student/:id\' route', function() {
  var id;

  hooks();

  it('should return a 200 status code and the modified student object when invoked with proper credentials, and valid data', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/students', 201, authInfo, newStud, function(err, res, body) {
        expect(err).to.not.exist;

        id = body._id;
        var modStud = {
          firstName: "ChangedName"
        };

        Object.keys(body).forEach(function(prop) {
          if (prop === "__v") {
            return;
          }
          if (prop === "_id") {
            expect(body).to.have.property('_id').equal(id);
            return;
          }
          expect(body).to.have.property(prop).deep.equal(newStud[prop]);
        });

        utils.apiSetup('put', '/api/student/' + id, 200, authInfo, modStud, function(err, res, body) {
          expect(err).to.not.exist;
          expect(body).to.exist;
          expect(body).to.have.property('firstName').equal('ChangedName');

          utils.apiSetup('delete', '/api/student/' + id, 204, authInfo, function(err, res, body) {
            expect(err).to.not.exist;

            done();
          });
        });
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
    var id = "abc";
    var newStud = {
      firstName: "ChangedName",
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('put', '/api/student/' + id, 400, authInfo, newStud, function(err, res, body) {
        expect(body).to.equal('Invalid data!');

        done();
      });
    });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newStud = {
      catName: "Ginger"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('put', '/api/student/' + id, 400, authInfo, newStud, function(err, res, body) {
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('put', '/api/student/' + id, 401, invalidHeaders, newStud, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with no user credentials whatsoever', function(done) {
    utils.apiSetup('put', '/api/student/' + id, 401, {}, newStud, done);
  });
});

describe('The DELETE \'/api/student/:id\' route', function() {
  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/students', 201, authInfo, newStud, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;

        var id = body._id;

        utils.apiSetup('delete', '/api/student/' + id, 204, authInfo, function(err, res, body) {
          expect(err).to.not.exist;

          utils.apiSetup('get', '/api/student/' + id, 400, authInfo, function(err, res, body) {
            expect(err).to.not.exist;
            expect(body).to.equal('Invalid data!');

            done();
          });
        });
      });
    });
  });

  it('should return a 204 status code in the case of a nonexistent id', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('delete', '/api/student/' + "abc", 204, authInfo, function(err, res, body) {
        expect(err).to.not.exist;

        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('delete', '/api/student/' + "abc", 401, invalidHeaders, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with no user credentials whatsoever', function(done) {
    utils.apiSetup('delete', '/api/student/' + "abc", 401, {}, done);
  });
});
