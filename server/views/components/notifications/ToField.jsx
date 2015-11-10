/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var Reflux = require('reflux');

var actions = require('../../actions/notificationActions.jsx');

var {
  Well,
  ButtonToolbar,
  ButtonGroup,
  Button
} = require('react-bootstrap');

var AlertDismissable = require('../alertDismissable.jsx');

var {
  ageCalculator,
  membershipStatusCalculator
} = require('../../bin/utils.jsx');

var ToField = module.exports = React.createClass({
  getInitialState: function() {
    var valid = true;

    if (!this.props.recipients || (this.props.recipients.length <= 0)) {
      valid = false;
    }

    return {
      valid: valid,
      recipients: this.props.recipients
    };
  },

  componentWillReceiveProps: function(newProps) {
    var valid = true;

    if (!newProps.recipients || (newProps.recipients.length <= 0)) {
      valid = false;
    }

    this.setState({
      valid: valid,
      recipients: newProps.recipients
    });
  },

  getValue: function() {
    return this.state.recipients;
  },

  removeRecipient: function(id) {
    var that = this;
    return function(e) {
      if (e) {
        e.preventDefault();
      }

      actions.removeRecipient(id);
    };
  },

  componentDidUpdate: function() {
    // this.props.onChange()
  },

  render: function() {
    var that = this;

    var recipientGroup;
    var recipients;

    var feedback;

    if (!this.state.valid) {
      feedback = (
        <p><strong>At least one recipient must be entered!</strong></p>
      );
    } else {
      recipients = this.state.recipients.map(function(recipient) {
        return (
          <ButtonGroup key={recipient.id}>
            <Button bsSize='xsmall'>
              {recipient.name}
            </Button>
            <Button bsSize='xsmall' onClick={that.removeRecipient(recipient._id)}>
              X
            </Button>
          </ButtonGroup>
        );
      });

      recipientGroup = (
        <ButtonToolbar>
          {recipients}
        </ButtonToolbar>
      );
    }

    return (
      <div id="notificationToField">
        <Well bsSize="small">
          {feedback}
          {recipientGroup}
        </Well>
      </div>
    );
  }
});