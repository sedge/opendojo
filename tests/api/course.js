var assert = require('assert'),
  expect = require('chai').expect,
  utils = require('../utils'),
  ranksList=[];

function hooks() {
  before(function(done) {
    // Because dry runs to spin up the server sometimes take more than 2s
    this.timeout(6000);
      utils.initServer( function () {
         addRanksToArray(done);
      });  
  });

  after(function(done) {
    deleteRanks( function () {
      utils.killServer(done);
    });
  });

}

function addRanksToArray( callback ) {
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

function deleteRanks( callback ) {
  var rankCount = ranksList.length;
  if (!rankCount) {
    return callback();
  }

  ranksList.forEach( function (rank) {
    utils.apiSetup('delete', '/rank/' + rank, 204, function(err, res, body) {
      rankCount--;  
      if (rankCount == 0) {
         ranksList=[];
        return callback();
      }
    });
  });
}

describe('The GET \'/classes/\' route', function() {
  
  hooks();
  
  it('should return a 200 status code and all the classes when invoked with proper credentials', function(done) {
    var d = new Date();
    var newCourse = {
          "class_title": "TestClass",
          "start_date": "2015-04-12T20:44:55.000Z",
          "end_date": "2015-04-12T20:44:55.000Z",
          "day_of_week": 3, 
          "start_time": d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
          "end_time":d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(), 
          "classType": "TestType", 
          "RanksAllowed": ranksList
    };
    utils.apiSetup('post', '/classes', 201, newCourse, function(err, res, body) {
      var idToDelete=body._id;
      utils.apiSetup('get', '/classes', 200, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.be.an('array');
        utils.apiSetup('delete', '/class/' + idToDelete, 204, function(err, res, body) {
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

describe('The POST \'/classes/\' route', function() {

  hooks();

  it('should return a 201 status code, along with the newly created class object when invoked using proper input data and credentials', function(done) {
    var d = new Date();
    var newCourse = {
          "class_title": "TestClass",
          "start_date": "2015-04-12T20:44:55.000Z",
          "end_date": "2015-04-12T20:44:55.000Z",
          "day_of_week": 3, 
          "start_time": d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
          "end_time":d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(), 
          "classType": "TestType", 
          "RanksAllowed": ranksList
    };

    utils.apiSetup('post', '/classes', 201, newCourse, function(err, res, body) {
      var idToDelete=body._id;
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
        expect(body).to.have.property(prop).deep.equal(newCourse[prop]);
      });
      utils.apiSetup('delete', '/class/' + idToDelete, 204, function(err, res, body)  {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newCourse = {
       "title":"Positions"
    };
    utils.apiSetup('post', '/classes', 400, newCourse, function(err, res, body) { 
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The GET \'/class/:id\' route', function() {
 
  hooks();

  it('should return a 200 status code and the corresponding class object when invoked with proper credentials, and a valid id string', function(done) {
   var d = new Date();
   var newCourse = {
          "class_title": "TestClass",
          "start_date": "2015-04-12T20:44:55.000Z",
          "end_date": "2015-07-12T20:44:55.000Z",
          "day_of_week": 3, 
          "start_time": d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
          "end_time":d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(), 
          "classType": "TestType", 
          "RanksAllowed": ranksList
    };
    utils.apiSetup('post', '/classes', 201, newCourse, function(err, res, body) {
      id=body._id; 
      utils.apiSetup('get', '/class/' + id, 200, function(err, res, body) {
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
        expect(body).to.have.property(prop).deep.equal(newCourse[prop]);
      });
        utils.apiSetup('delete', '/class/' + body._id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 404 status code and a custom \'bad request\' error message when invoked without providing an id', function(done) {
    id="";
    utils.apiSetup('get', '/class/' + id, 404, function(err, res, body) {
      done();
    });
  });

  it('should return a 400 status code and an id not found message if an id is not found', function(done) {
    id="abc";
    utils.apiSetup('get', '/class/' + id, 400, function(err, res, body) {
      expect(body).to.equal('ID not found!');
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The PUT \'/class/:id\' route', function() {
  var id;

  hooks();

  it('should return a 200 status code and the modified class object when invoked with proper credentials, and valid data', function(done) {
    var d = new Date();
    var newCourse = {
          "class_title": "TestClass",
          "start_date": "2015-04-12T20:44:55.000Z",
          "end_date": "2015-07-12T20:44:55.000Z",
          "day_of_week": 3, 
          "start_time": d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
          "end_time":d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(), 
          "classType": "TestType", 
          "RanksAllowed": ranksList
    };

    utils.apiSetup('post', '/classes', 201, newCourse, function(err, res, body) {
      id=body._id;
      var modClass = {
        "class_title": "ChangedName"
      };
      utils.apiSetup('put', '/class/' + id, 200, modClass, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.have.property('class_title').equal('ChangedName');
        
        utils.apiSetup('delete', '/class/' + id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 400 status code and an id not found message if an id is not found', function(done) {
      var id="abc";
      var newCourse = {
        "class_title": "ChangedName",
      };
      utils.apiSetup('put', '/class/' + id, 400, newCourse, function(err, res, body) {
          expect(body).to.equal('ID not found!');
          done();
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newCourse = {
       "catName":"Ginger"
    };
    utils.apiSetup('put', '/class/' + id, 400, newCourse, function(err, res, body) {
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The DELETE \'/class/:id\' route', function() {

  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {
    var d = new Date();
    var newCourse = {
          "class_title": "TestClass",
          "start_date": "2015-04-12T20:44:55.000Z",
          "end_date": "2015-07-12T20:44:55.000Z",
          "day_of_week": 3, 
          "start_time": d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(),
          "end_time":d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(), 
          "classType": "TestType", 
          "RanksAllowed": ranksList
    };

    utils.apiSetup('post', '/classes', 201, newCourse, function(err, res, body) {
      utils.apiSetup('delete', '/class/' + body._id, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 204 status code in the case of a nonexistent id', function(done) {
    utils.apiSetup('delete', '/class/' + "abc", 204, function(err, res, body) {
      expect(err).to.not.exist;
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});
