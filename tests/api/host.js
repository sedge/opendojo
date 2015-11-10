/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

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
