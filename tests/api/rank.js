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

describe('The GET \'/api/ranks/\' route', function() {
  hooks();

  it('should return a 200 status code and all the ranks when invoked with proper credentials', function(done) {
    var idToDelete;
    var newRank = {
      name: "Black",
      sequence: 1,
      color: "black"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/ranks', 201, authInfo, newRank, function(err, res, body) {
        idToDelete=body._id;
        expect(err).to.not.exist;
        utils.apiSetup('get', '/api/ranks', 200, authInfo, function(err, res, body) {
          expect(err).to.not.exist;
          expect(body).to.exist;
          expect(body).to.be.an('array');
          utils.apiSetup('delete', '/api/rank/' + idToDelete, 204, authInfo, function(err, res, body) {
            expect(err).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('get', '/api/ranks', 401, invalidHeaders, done);
  });
});

describe('The POST \'/api/ranks/\' route', function() {
  hooks();

  it('should return a 201 status code, along with the newly created rank object when invoked using proper input data and credentials', function(done) {
    var newRank = {
      name: "GrayTest",
      sequence: 2,
      color: "grayTest"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('post', '/api/ranks', 201, authInfo, newRank, function(err, res, body) {
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
        utils.apiSetup('delete', '/api/rank/' + body._id, 204, authInfo, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newRank = {
       catName:"Spot"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('post', '/api/ranks', 400, authInfo, newRank, function(err, res, body) {
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    var newRank = {
      name: "Black",
      sequence: 1,
      color: "black"
    };

    utils.apiSetup('post', '/api/ranks', 401, invalidHeaders, newRank, done);
  });
});

describe('The GET \'/api/rank/:id\' route', function() {
  hooks();

  it('should return a 200 status code and the corresponding rank object when invoked with proper credentials, and a valid id string', function(done) {
    var newRank = {
      name: "White",
      sequence: 3,
      color: "white"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('post', '/api/ranks', 201, authInfo, newRank, function(err, res, body) {
        expect(err).to.not.exist;
        id=body._id;
        utils.apiSetup('get', '/api/rank/' + id, 200, authInfo, function(err, res, body) {
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
          utils.apiSetup('delete', '/api/rank/' + body._id, 204, authInfo, function(err, res, body) {
            expect(err).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('should return a 404 status code when invoked without providing an id', function(done) {
    id="";

    utils.jwtSetup(options, function(err, res, body, authInfo){
      utils.apiSetup('get', '/api/rank/' + id, 404, authInfo, done);
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
    id="fey";

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('get', '/api/rank/' + id, 400, authInfo, function(err, res, body) {
        expect(body).to.equal('Invalid data!');
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    var id = "sh0uldntmatt3r";

    utils.apiSetup('get', '/api/ranks' + id, 401, invalidHeaders, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid no user credentials whatsoever', function(done) {
    var id = "st1llsh0uldntmatt3r";

    utils.apiSetup('get', '/api/ranks' + id, 401, {}, done);
  });
});

describe('The PUT \'/api/rank/:id\' route', function() {
  var id;

  hooks();

  it('should return a 200 status code and the modified rank object when invoked with proper credentials, and valid data', function(done) {
    var newRank = {
      name: "Pink",
      sequence: 4,
      color: "pink"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/ranks', 201, authInfo, newRank, function(err, res, body) {
        expect(err).to.not.exist;
        id=body._id;
        var modRank = {
          name: "Magenta"
        };
        utils.apiSetup('put', '/api/rank/' + id, 200, authInfo, modRank, function(err, res, body) {
          expect(err).to.not.exist;
          expect(body).to.exist;
          expect(body).to.have.property('name').equal('Magenta');
          utils.apiSetup('delete', '/api/rank/' + id, 204, authInfo, function(err, res, body) {
            expect(err).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('should return a 400 status code and an invalid data message if an id is not found', function(done) {
      var id="abc";
      var newRank = {
        name: "Crimson"
      };

      utils.jwtSetup(options, function(err, res, body, authInfo) {
        utils.apiSetup('put', '/api/rank/' + id, 400, authInfo, newRank, function(err, res, body) {
          expect(body).to.equal('Invalid data!');
          done();
        });
      });
  });


  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done) {
    var newRank = {
      catName:"Einstein"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('put', '/api/rank/' + id, 400, authInfo, newRank, function(err, res, body) {
        expect(body).to.equal('Invalid data!');
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    var newRank = {
      name: "Cauliflower"
    };

    utils.apiSetup('put', '/api/rank/' + id, 401, invalidHeaders, newRank, done);
  });
});

describe('The DELETE \'/api/rank/:id\' route', function() {
  hooks();

  it('should return a 204 when invoked with the proper credentials, and valid data', function(done) {

    var newRank = {
      name: "Purple",
      sequence: 5,
      color: "purple"
    };

    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('post', '/api/ranks', 201, authInfo, newRank, function(err, res, body) {
        expect(err).to.not.exist;
        utils.apiSetup('delete', '/api/rank/' + body._id, 204, authInfo, function(err, res, body) {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  it('should return a 204 status code in the case of a nonexistent id', function(done) {
    utils.jwtSetup(options, function(err, res, body, authInfo) {
      utils.apiSetup('delete', '/api/rank/' + "abc", 204, authInfo, function(err, res, body) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done) {
    utils.apiSetup('delete', '/api/rank/' + "abc", 401, invalidHeaders, done);
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with no user credentials whatsoever', function(done) {
    utils.apiSetup('delete', '/api/rank/' + "abc", 401, {}, done);
  });
});