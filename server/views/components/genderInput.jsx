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
  isLength
} = require('validator');

var {
  Input
} = require('react-bootstrap');

var LastName = module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true,
      value: this.props.defaultValue
    };
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  render: function() {
    var props = {
      label: this.props.label,
      type: "select",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value
    };

    var feedback;
    if (!this.state.valid) {
      feedback = (
        <p><strong>A last name is required, and must only be letters.</strong></p>
      );
    }

    return (
      <div>
        <Input {...props} onChange={this.onChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="N/A">N/A</option>
        </Input>
        {feedback}
      </div>
    );
  }
});