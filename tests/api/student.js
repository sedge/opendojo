var assert = require('assert'),
  expect = require('chai').expect,
  utils = require('../utils'),
  newStud,
  rankId="";

function hooks() {
  before(function(done) {
    // Because dry runs to spin up the server sometimes take more than 2s
    this.timeout(6000);
      utils.initServer( function () {
         addRanks( function () {
          createStudentObject(done);
        });
      });  
  });

  after(function(done) {
    deleteRanks( function () {
      utils.killServer(done);
    });
  });
}

function createStudentObject( callback ) {
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

function addRanks( callback ) {
  var newRank = {
    name: "Black",
    sequence: 1,
    color: "black"
  };

  utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
    rankId = body._id;
    callback();
  });
}

function deleteRanks( callback ) {
  if (rankId == "") {
    return callback();
  }
 utils.apiSetup('delete', '/rank/' + rankId, 204, function(err, res, body) {
    rankId = "";
    return callback();
  });
}

describe('The GET \'/students/\' route', function() {
  hooks();
  
  it('should return a 200 status code and all the students when invoked with proper credentials', function(done) {
    var studentIdToDelete;
    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      studentIdToDelete = body._id;
      utils.apiSetup('get', '/students', 200, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.be.an('array');
          utils.apiSetup('delete', '/student/' + studentIdToDelete, 204, function(err, res, body) {
            expect(err).to.not.exist;
            done();
          });
      });
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The POST \'/students/\' route', function() {
  hooks();

  it('should return a 201 status code, along with the newly created student object when invoked using proper input data and credentials', function(done) {
    var studentIdToDelete;

    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
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
      studentIdToDelete = body._id;
      utils.apiSetup('delete', '/student/' + studentIdToDelete, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newStud = {
      catName:"Ginger"
    };
    utils.apiSetup('post', '/students', 400, newStud, function(err, res, body) {
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The GET \'/student/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the corresponding student object when invoked with proper credentials, and a valid id string', function(done) {
    console.log("new student is ", newStud);
    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      id=body._id;
      console.log("id is ", id); 
      utils.apiSetup('get', '/student/' + id, 200, function(err, res, body) {
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
        utils.apiSetup('delete', '/student/' + body._id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 404 status code and a custom \'bad request\' error message when invoked without providing an id', function(done) {
    id="";
    utils.apiSetup('get', '/student/' + id, 404, done);
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
    id="abc";
    utils.apiSetup('get', '/student/' + id, 400, function(err, res, body) {
      expect(body).to.equal('Invalid data!');
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The PUT \'/student/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the modified student object when invoked with proper credentials, and valid data', function(done) {
    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      id=body._id;
      var modStud = {
        firstName: "ChangedName"
      };
      utils.apiSetup('put', '/student/' + id, 200, modStud, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.have.property('firstName').equal('ChangedName');
        utils.apiSetup('delete', '/student/' + id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
      var id="abc";
      var newStud = {
        firstName: "ChangedName",
      };
      utils.apiSetup('put', '/student/' + id, 400, newStud, function(err, res, body) {
          expect(body).to.equal('Invalid data!');
          done();
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newStud = {
      catName:"Ginger"
    };
    utils.apiSetup('put', '/student/' + id, 400, newStud, function(err, res, body) {
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The DELETE \'/student/:id\' route', function() {
  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {
    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      utils.apiSetup('delete', '/student/' + body._id, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 204 status code in the case of a nonexistent id', function(done) {
    utils.apiSetup('delete', '/student/' + "abc", 204, function(err, res, body) {
      expect(err).to.not.exist;
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});
