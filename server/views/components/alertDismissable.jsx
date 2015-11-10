/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var {
  Alert,
  Button
} = require('react-bootstrap');

var AlertDismissable = module.exports = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: this.props.visable
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      alertVisible: newProps.visable
    });
  },

  render: function() {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
          <h4>Have you checked it twice?</h4>
          <p>See those coloured fields? Make sure your data is valid before clicking save!</p>
        </Alert>
      );
    }

    return (
      <div></div>
    );
  },

  handleAlertDismiss: function() {
    this.setState({alertVisible: false});
  },

  handleAlertShow: function() {
    this.setState({alertVisible: true});
  }
});
