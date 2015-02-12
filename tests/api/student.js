var assert = require('assert'),
  expect = require('chai').expect,
  utils = require('../utils');

describe('The GET \'/students/\' route', function(){
  before(function(done){
    // Because dry runs to spin up the server sometimes take more than 2s
    this.timeout(5000);

    utils.initServer(done);
  });

  after(function(done){
    utils.killServer(done);
  });

  it('should return a 200 status code and all the students when invoked with proper credentials', function(done){
    utils.apiSetup('get', '/students', 200, function(){
      expect(body).to.exist;

      done();
    });
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
    done();
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});

describe('The POST \'/students/\' route', function(){
  it('should return a 200 status code, along with the newly created student object when invoked using proper input data and credentials', function(done){
    done();
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
    done();
  });

  it.skip('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});

describe('The GET \'/student/:id\' route', function(){
  it('should return a 200 status code and the corresponding student object when invoked with proper credentials, and a valid id string', function(done){
    done();
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
    done();
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});

describe('The PUT \'/student/:id\' route', function(){
  it('should return a 200 status code the modified student object when invoked with proper credentials, and valid data', function(done){
    done();
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
    done();
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});

describe('The DELETE \'/student/:id\' route', function(){
  it('should return a 204 when invoked with the proper credentials, and valid data', function(done){
    done();
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
    done();
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});

describe('The GET \'/students/rank/:colour\' route', function(){
  it('should return a 200 status code and all the students possessing the given colour when invoked with proper credentials', function(done){
    done();
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
  done();
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});

describe('The GET \'/students/member/:status\' route', function(){
  it('should return a 200 status code and all the students bearing the requested status when invoked with proper credentials', function(done){
    done();
  });

  it('should return a 400 status code and a custom \'bad request\' error message when invoked with any invalid request body data', function(done){
  done();
  });

  it('should return a 401 status code and a default \'unauthorized\' error when invoked with invalid user credentials', function(done){
    done();
  });
});
