/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var $ = require('jquery');
var {
  isAlpha,
  isLength,
  blacklist
} = require('validator');

var {
  Button
} = require('react-bootstrap');

var DeleteClassButton = module.exports = React.createClass({

  onClick: function(e) {
    this.props.onClick(e, this.props.classId);
  },

  render: function() {
    return (
        <Button bsSize={this.props.bsSize} bsStyle='warning' onClick={this.onClick} >Delete</Button>
    );
  }
});
