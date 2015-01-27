var assert = require('assert'),
  expect = require('chai').expect,
  utils = require('./utils');

describe('The parent route', function(){
  before(function(done){
    // Because dry runs to spin up the server sometimes take more than 2s
    this.timeout(5000);

    utils.initServer(done);
  });

  it('should return a 200 status upon invocation', function(done){
    utils.apiSetup('get', 200, done);
  });

  it('should return a 404 status upon an incompatible verb request (post)', function(done){
    utils.apiSetup('post', 404, { stuff: "things" }, done);
  });

  after(function(done){
    utils.killServer(done);
  });
});
