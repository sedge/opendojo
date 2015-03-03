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

describe('The GET \'/ranks/\' route', function() {
  hooks();
  
  it('should return a 200 status code and all the ranks when invoked with proper credentials', function(done) {
    var idToDelete;
    var newRank = {
      name: "Black",
      sequence: 1,
      color: "black"
    };
    
    utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
      idToDelete=body._id;
      expect(err).to.not.exist;
      utils.apiSetup('get', '/ranks', 200, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.be.an('array');
        utils.apiSetup('delete', '/rank/' + idToDelete, 204, function(err, res, body) {
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

describe('The POST \'/ranks/\' route', function() {
  hooks();

  it('should return a 201 status code, along with the newly created rank object when invoked using proper input data and credentials', function(done) {
    var newRank = {
      name: "GrayTest",
      sequence: 2,
      color: "grayTest"
    };

    utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
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
        expect(body).to.have.property(prop).deep.equal(newRank[prop]);
      });
      utils.apiSetup('delete', '/rank/' + body._id, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newRank = {
       catName:"Spot"
    };
    utils.apiSetup('post', '/ranks', 400, newRank, function(err, res, body) {
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The GET \'/rank/:id\' route', function() {
  var newRank;
  
  hooks();

  it('should return a 200 status code and the corresponding rank object when invoked with proper credentials, and a valid id string', function(done) {
   var newRank = {
      name: "White",
      sequence: 3,
      color: "white"
    };

    utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
      expect(err).to.not.exist;
      id=body._id; 
      utils.apiSetup('get', '/rank/' + id, 200, function(err, res, body) {
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
        expect(body).to.have.property(prop).deep.equal(newRank[prop]);
      });
        utils.apiSetup('delete', '/rank/' + body._id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 404 status code when invoked without providing an id', function(done) {
    id="";
    utils.apiSetup('get', '/rank/' + id, 404, done);
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
    id="fey";
    utils.apiSetup('get', '/rank/' + id, 400, function(err, res, body) {
      expect(body).to.equal('Invalid data!');
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The PUT \'/rank/:id\' route', function() {
  var id;

  hooks();

  it('should return a 200 status code and the modified rank object when invoked with proper credentials, and valid data', function(done) {
    var newRank = {
      name: "Pink",
      sequence: 4,
      color: "pink"
    };

    utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
      expect(err).to.not.exist;
      id=body._id;
      var modRank = {
        name: "Magenta"
      };
      utils.apiSetup('put', '/rank/' + id, 200, modRank, function(err, res, body) {
        expect(err).to.not.exist;
        expect(body).to.exist;
        expect(body).to.have.property('name').equal('Magenta');
        utils.apiSetup('delete', '/rank/' + id, 204, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
      var id="abc";
      var newRank = {
        name: "Crimson",
      };
      utils.apiSetup('put', '/rank/' + id, 400, newRank, function(err, res, body) {
          expect(body).to.equal('Invalid data!');
          done();
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newRank = {
      catName:"Einstein"
    };
    utils.apiSetup('put', '/rank/' + id, 400, newRank, function(err, res, body) {
      expect(body).to.equal('Invalid data!');
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});

describe('The DELETE \'/rank/:id\' route', function() {
  var newRank;

  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {
    
    var newRank = {
      name: "Purple",
      sequence: 5,
      color: "purple"
    };

    utils.apiSetup('post', '/ranks', 201, newRank, function(err, res, body) {
      expect(err).to.not.exist;
      utils.apiSetup('delete', '/rank/' + body._id, 204, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 204 status code in the case of a nonexistent id', function(done) {
    utils.apiSetup('delete', '/rank/' + "abc", 204, function(err, res, body) {
      expect(err).to.not.exist;
      done();
    });
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    done();
  });
});
