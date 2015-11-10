/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var MessageActions = module.exports = Reflux.createActions({
  editMessage: {
    asyncResult: true
  },
});

