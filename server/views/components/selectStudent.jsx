/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var $ = require('zeptojs');

var moment = require('moment');

var {
  ListenerMixin
} = require('reflux');

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var RouteHandler = Router.RouteHandler;
//   ...
var {
  RouteHandler,
  Navigation
} = Router;

var {
  Row,
  Col,
  Jumbotron,
  Navbar,
  Button
} = require('react-bootstrap');

var {
  timeFormatting,
  sortByKey,
  momentForTime,
  timeToMilliseconds
} = require('../bin/utils.jsx');

var SelectStudent = React.createClass({
  mixins: [Navigation],

  componentWillMount: function() {
    // Prevent the view from rendering if it isn't in
    // terminal mode
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }
  },

  render: function() {
    var students = this.props.students;
    var classes = this.props.classes;

    var studentKey = 0;
    var classKey = 0;

    var view;

    if (!students.length || !classes.length) {
      return (
        <div id="terminal" />
      );
    }

    return (
      <div id="terminal">
        <RouteHandler students={students} classes={classes} />
      </div>
    );
  }
});

module.exports = SelectStudent;
