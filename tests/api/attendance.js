var assert = require('assert'),
  expect = require('chai').expect,
  utils = require('../utils'),
  classIdToDelete,
  studentIdToDelete,
  newRec,
  newStud,
  newCourse,
  ranksList=[];

function hooks() {
  before(function(done) {
    // Because dry runs to spin up the server sometimes take more than 2s
    this.timeout(6000);
    utils.initServer( function () {
      addRanks( function () {
        createObjects( function () {
          createRecord (done);
        });
      });
    });  
  });

  after(function(done) {
    deleteObjects( function () {
      utils.killServer(done);
    });
  });
}

function createObjects( callback ) {
  var emailArr = ["testemail@email.com"];
  var d = new Date();
  newStud = {
    firstName: "TestFName",
    lastName: "TestLName",
    gender: "F",
    rankId: ranksList[0],
    healthInformation: "functioning within established parameters",
    guardianInformation: "guardian angel",
    email: emailArr, //this is an array and should be passed in as such on the client request
    membershipStatus: true,
    membershipExpiry: "2015-04-12T20:44:55.000Z",
    phone: "111-222-3333",
    birthDate: "2004-04-12T20:44:55.000Z"
  };  
  newCourse = {
    classTitle: "TestClass",
    startDate: "2015-04-12T20:44:55.000Z",
    endDate: "2015-04-12T20:44:55.000Z",
    dayOfWeek: 3, 
    startTime: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
    endTime:d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(), 
    classType: "TestType", 
    RanksAllowed: ranksList
    };
  utils.apiSetup('post', '/classes', 201, newCourse, function(err, res, body) {
    classIdToDelete=body._id;
    utils.apiSetup('post', '/students', 201, newStud, function(err, res, body) {
      studentIdToDelete = body._id;
      callback();
    });
  });
}

function createRecord ( done ) {
  var d = new Date();
  newRec = {
    studentID: studentIdToDelete,
    classDate: "2015-04-12T20:44:55.000Z",
    classTime: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
    classID: classIdToDelete
  }; 
  done(); 
}

function addRanks( callback ) {
  var newRank = {
      "name": "Black",
      "sequence": 1,
      "color": "black"
  };
 
  var newRank2 = {
      "name": "White",
      "sequence": 2,
      "color": "white"
  };
 
  utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
    ranksList.push(body._id);
    utils.apiSetup('post', '/ranks', 201, newRank2, function(err, res, body) {
      ranksList.push(body._id);
      callback();  
    });
  });
}

function deleteObjects( callback ) {
  var rankCount = ranksList.length;
  if (!rankCount) {
    return callback();
  }

  ranksList.forEach( function (rank) {
    utils.apiSetup('delete', '/rank/' + rank, 204, function(err, res, body) {
      if (--rankCount === 0) {
        ranksList=[];
        utils.apiSetup('delete', '/student/' + studentIdToDelete, 204, function(err, res, body) { 
          utils.apiSetup('delete', '/class/' + classIdToDelete, 204, function(err, res, body) {
            callback();
          });
        });  
      }
    });
  });
}

describe('The GET \'/records/\' route', function() {
  hooks();
  
  it('should return a 200 status code and all the records when invoked with proper credentials', function(done) {
    var recordIdToDelete;
    utils.apiSetup('post', '/records', 201, newRec, function(err, res, body) {
      recordIdToDelete = body._id;
      utils.apiSetup('get', '/records', 200, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.be.an('array');
        utils.apiSetup('delete', '/record/' + recordIdToDelete, 204, function(err, res, body) {
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

describe('The POST \'/records/\' route', function() {
  hooks();

  it('should return a 201 status code, along with the newly created attendance object when invoked using proper input data and credentials', function(done) {
    var recordIdToDelete;

    utils.apiSetup('post', '/records', 201, newRec, function(err, res, body) {
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
        expect(body).to.have.property(prop).deep.equal(newRec[prop]);
      });
      recordIdToDelete = body._id;
      utils.apiSetup('delete', '/record/' + recordIdToDelete, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newRec = {
      starShip:"Enterprise"
    };
    utils.apiSetup('post', '/records', 400, newRec, function(err, res, body) {
      done();
      expect(body).to.equal('Invalid data!');
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The GET \'/record/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the corresponding attendance object when invoked with proper credentials, and a valid id string', function(done) {
    utils.apiSetup('post', '/records', 201, newRec, function(err, res, body) {
      expect(err).to.not.exist;
      var id=body._id;
      utils.apiSetup('get', '/record/' + id, 200, function(err, res, body) {
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
          expect(body).to.have.property(prop).deep.equal(newRec[prop]);
        });
        utils.apiSetup('delete', '/record/' + body._id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 404 status code when invoked without providing an id', function(done) {
    var id="";
    utils.apiSetup('get', '/record/' + id, 404, done);
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
    var id="abc";
    utils.apiSetup('get', '/record/' + id, 400, function(err, res, body) {
      expect(body).to.equal('Invalid data!');
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The PUT \'/record/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the modified attendance object when invoked with proper credentials, and valid data', function(done) {
    utils.apiSetup('post', '/records', 201, newRec, function(err, res, body) {
      expect(err).to.not.exist;
      var id=body._id;
      var modRec = {
        classDate: "2018-08-12T20:44:55.000Z"
      };
      utils.apiSetup('put', '/record/' + id, 200, modRec, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.have.property('classDate').equal('2018-08-12T20:44:55.000Z');
        utils.apiSetup('delete', '/record/' + id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
      var id="abc";
      var modRec = {
        classDate: "2018-08-12T20:44:55.000Z"
      };
      utils.apiSetup('put', '/record/' + id, 400, modRec, function(err, res, body) {
          expect(body).to.equal('Invalid data!');
          done();
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var modRec = {
      catName:"Ginger"
    };
    utils.apiSetup('put', '/record/' + id, 400, modRec, function(err, res, body) {
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The DELETE \'/record/:id\' route', function() {
  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {
    utils.apiSetup('post', '/records', 201, newRec, function(err, res, body) {
      expect(err).to.not.exist;
      utils.apiSetup('delete', '/record/' + body._id, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 204 status code in the case of a nonexistent id', function(done) {
    utils.apiSetup('delete', '/record/' + "abc", 204, function(err, res, body) {
      expect(err).to.not.exist;
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});
