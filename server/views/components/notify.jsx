/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');

var Reflux = require('reflux');
var { Navigation } = require('react-router');

var notificationStore = require('../stores/notificationStore.jsx');

var actions = require('../actions/notificationActions.jsx');

var {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Button
} = require('react-bootstrap');

// Custom components
var AlertDismissable = require('./alertDismissable.jsx');
var ToField = require('./notifications/toField.jsx');
var SubjectField = require('./notifications/subjectField.jsx');
var BodyField = require('./notifications/bodyField.jsx');
var StudentFilter = require('./notifications/studentFilter.jsx');

var TerminalCheck = require('../mixins/terminalCheck.jsx')

var Notify = module.exports = React.createClass({
  // Provides access to the router context object,
  // containing route-aware state (URL info etc.)
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Navigation,
    TerminalCheck,

    // Action listeners
    Reflux.listenTo(notificationStore, "handleNotificationUpdate")
  ],

  getInitialState: function() {
    return {
      recipients: [],

      sent: false,
      valid: false
    };
  },

  handleNotificationUpdate: function(payload) {
    var flag = payload.flag;
    if (flag === "failed") {
      alert("Notification failed!");
      // this.reset();
      return;
    }
    if (flag === "succeeded") {
      alert("Notification succeeded!");
      // this.reset();
      return;
    }
    if (flag === "reset") {
      // this.reset();
    }

    var newState = {
      recipients: payload.recipients
    };

    if (!newState.recipients.length) {
      newState.valid = false;
    }

    this.setState(newState);
  },

  sendNotification: function() {
    if(!this.state.valid) {
      return;
    }

    var doSend = confirm("Send the notification?");

    if (!doSend) {
      return;
    }

    actions.sendNotification({
      recipients: this.state.recipients,
      subject: this.refs.subject.getValue(),
      message: this.refs.contents.getValue()
    });
  },

  onChange: function() {
    var {
      to,
      subject,
      contents
    } = this.refs;

    if(!subject.state.valid
        || !contents.state.valid
        || !to.state.valid
      ) {
      this.setState({
        valid: false
      });
      return;
    }

    if (!this.state.valid) {
      this.setState({
        valid: true
      });
    }
  },

  handleReset: function() {
    var doReset = confirm("Do you really want to reset the notification?");

    if (!doReset) {
      return;
    }

    actions.reset();
  },

  render: function() {
    // Force a blank render to make the transition prettier
    if (this.props.terminalMode) {
      return (<div/>);
    }

    var submit;

    if (this.state.valid) {
      submit = (
        <Button bsStyle="primary" onClick={this.sendNotification}>
          Send Notification
        </Button>
      );
    } else {
      submit = (
        <Button bsStyle="primary" onClick={this.sendNotification} disabled>
          Send Notification
        </Button>
      );
    }

    return (
      <div id="notifications">
        <Row>
          <Col md={8}>
            <form className="form-horizontal">
              <SubjectField ref="subject" placeholder="Subject line here" onChange={this.onChange} />
              <ToField ref="to" recipients={this.state.recipients} onChange={this.onChange} />
              <BodyField ref="contents" placeholder="Your message here" onChange={this.onChange} />

              <ButtonToolbar>
                {submit}
                <Button bsStyle="warning" onClick={this.handleReset}>
                  Reset
                </Button>
              </ButtonToolbar>
            </form>
          </Col>
          <Col md={4}>
            <StudentFilter />
          </Col>
        </Row>
      </div>
    );
  }
});