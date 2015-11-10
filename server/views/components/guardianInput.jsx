/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var $ = require('jquery');
var {
  isLength,
  isAlpha,
  blacklist
} = require('validator');

var {
  Input
} = require('react-bootstrap');

var FirstName = module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true,
      value: this.props.defaultValue
    };
  },

  onChange: function(e) {
    var ref = this.refs[this.props.name];
    var value = ref.getValue().trim();

    // Allow whitespace
    var sanitized = blacklist(value, " ")

    if (isLength(value, 0, 0)){
      // If it's empty we're okay since it's optional
    } else if (!isLength(sanitized, 1) || !isAlpha(sanitized)) {
      return this.setState({
        valid: false,
        value: value
      });
    }

    if (!this.state.valid) {
      this.setState({
        valid: true,
        value: value
      });
    }
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  validationState: function() {
    if (this.state.valid) {
      return;
    }
    return "error";
  },

  render: function() {
    var props = {
      label: this.props.label,
      type: "text",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value,
      placeholder: this.props.placeholder
    };
    if (this.validationState()) {
      props.bsStyle = this.validationState();
    }

    var feedback;
    if (!this.state.valid) {
      feedback = (
        <p><strong>This field is optional! Enter a name or nothing.</strong></p>
      );
    }

    return (
      <div>
        <Input {...props} onChange={this.onChange} />
        {feedback}
      </div>
    );
  }
});