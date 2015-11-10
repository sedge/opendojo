/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var Reflux = require('reflux');

var {
  Input,
  Panel
} = require('react-bootstrap');

var {
  isLength
} = require('validator');

var SubjectField = module.exports = React.createClass({
  getInitialState: function() {
    var valid = true;

    if (!this.props.subject) {
      valid = false;
    }

    return {
      valid: valid,
      subject: this.props.subject
    };
  },

  onChange: function(e) {
    if(e) e.preventDefault();

    var valid = true;
    var value = this.refs.input.getValue();

    if (!value) {
      valid = false;
    }

    if (!isLength(value, 1, 100)) {
      valid = false;
    }

    this.setState({
      valid: valid,
      subject: value
    });

    this.props.onChange();
  },

  getValue: function() {
    return this.refs.input.getValue();
  },

  render: function() {
    var props = {
      type: 'text',
      ref: 'input',
      value: this.state.subject,
      placeholder: this.props.placeholder
    };

    return (
      <Panel id="notificationSubjectField" header="Subject:">
        <Input {...props} onChange={this.onChange} />
      </Panel>
    );
  }
});