var assert = require('assert'),
  expect = require('chai').expect,
  utils = require('../utils');

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

//Before the scripts are run the _dbSamplesGen should be ran to generate rank ids
describe('The GET \'/students/\' route', function() {
  
  hooks();
  
  it('should return a 200 status code and all the students when invoked with proper credentials', function(done) {
    var emailArr = ["testemail@email.com"];
    var newStud = {
        "firstName": "TestFName",
        "lastName": "TestLName",
        "gender": "F",
        "rankId": "54da74e15fac9fec3c848fab",
        "healthInformation": "functioning within established parameters",
        "guardianInformation": "guardian angel",
        "email": emailArr, //this is an array and should be passed in as such on the client request
        "membershipStatus": true,
        "membershipExpiry": "2015-04-12T20:44:55.000Z",
        "phone": "647-222-3333",
        "birthDate": "2004-04-12T20:44:55.000Z"
    };

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
      utils.apiSetup('get', '/students', 200, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.be.an('array');
        done();
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
    var emailArray = ["testemail@email.com","testemail2@email.com" ]
    var newStud = {
        "firstName": "TestFName",
        "lastName": "TestLName",
        "gender": "F",
        "rankId": "54da74e15fac9fec3c848fab",
        "healthInformation": "functioning within established parameters",
        "guardianInformation": "guardian angel",
        "email": emailArray, //this is an array and should be passed in as such on the client request
        "membershipStatus": true,
        "membershipExpiry": "2015-04-12T20:44:55.000Z",
        "phone": "111-222-3333",
        "birthDate": "2004-04-12T20:44:55.000Z"
    };

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
      utils.apiSetup('delete', '/student/' + body._id, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newStud = {
       "catName":"Ginger"
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
  var newStud;
  
  hooks();

  it('should return a 200 status code and the corresponding student object when invoked with proper credentials, and a valid id string', function(done) {
   var emailArr = ["damon@salvatore.com"];
   newStud = {
      "firstName": "Damon",
      "lastName": "Salvatore",
      "gender": "M",
      "rankId": "54da74e15fac9fec3c848fab",
      "healthInformation":"healthy",
      "guardianInformation": "stephan",
      "email": emailArr,
      "membershipStatus": true,
      "membershipExpiry": "2009-04-12T20:44:55.000Z",
      "phone": "444-333-3333",
      "birthDate": "1685-04-12T20:44:55.000Z"
    };

    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      expect(body).to.exist;
      id=body._id; 
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
    utils.apiSetup('get', '/student/' + id, 404, function(err, res, body) {
      done();
    });
  });

  it('should return a 400 status code and an id not found message if an id is not found', function(done) {
    id="abc";
    utils.apiSetup('get', '/student/' + id, 400, function(err, res, body) {
      expect(body).to.equal('ID not found!');
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The PUT \'/student/:id\' route', function() {
  var id;

  hooks();

  it('should return a 200 status code and the modified student object when invoked with proper credentials, and valid data', function(done) {
    var emailArr=["damon@salvatore.com"];

    var newStud = {
      "firstName": "Damon",
      "lastName": "Salvatore",
      "gender": "M",
      "rankId": "54da74e15fac9fec3c848fab",
      "healthInformation":"healthy",
      "guardianInformation": "stephan",
      "email": emailArr,
      "membershipStatus": true,
      "membershipExpiry": "2009-04-12T20:44:55.000Z",
      "phone": "444-333-3333",
      "birthDate": "1685-04-12T20:44:55.000Z"
    };

    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      expect(body).to.exist;
      id=body._id;
      var modStud = {
        "firstName": "ChangedName"
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

  it('should return a 400 status code and an id not found message if an id is not found', function(done) {
      var id="abc";
      var newStud = {
        "firstName": "ChangedName",
      };
      utils.apiSetup('put', '/student/' + id, 400, newStud, function(err, res, body) {
          expect(body).to.equal('ID not found!');
          done();
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newStud = {
       "catName":"Ginger"
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
  var newStud;

  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {
    newStud = {
        "firstName": "DeleteFName",
        "lastName": "DeleteLName",
        "gender": "F",
        "rankId": "54da74e15fac9fec3c848fab",
        "healthInformation": "am gonna be deleted",
        "guardianInformation": "guardian angel",
        "email": "deletemail@email.com", //this is an array and should be passed in as such on the client request
        "membershipStatus": false,
        "membershipExpiry": "2015-04-12T20:44:55.000Z",
        "phone": "111-467-3333",
        "birthDate": "2004-04-12T20:44:55.000Z"
    };

    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      expect(err).to.not.exist;
      expect(body).to.exist;
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
