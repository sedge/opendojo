var assert = require('assert');
var expect = require('chai').expect;
var utils = require('../utils');

describe('The parent route', function(){
  before(function(done){
    utils.initServer(done);
  });

  after(function(done){
    utils.killServer(done);
  });

  it('should return a 200 status upon invocation', function(done){
    utils.apiSetup('get', '/', 200, {}, done);
  });

  it('should return a 404 status upon an incompatible verb request (post)', function(done){
    utils.apiSetup('post', '/', 404, {}, {stuff: "things"}, done);
  });
});
