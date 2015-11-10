/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var moment = require('moment');

var { ListenerMixin } = require('reflux');
var {
  Modal,
  Table,
  Glyphicon,
  Row,
  Col
} = require('react-bootstrap');
var {
  getGreetingTime,
  timeFormatting
} = require('../bin/utils.jsx');

var { Navigation } = require('react-router');
var TerminalCheck = require('../mixins/terminalCheck.jsx');
var classStore = require('../stores/classStore.jsx');
var rankStore = require('../stores/rankStore.jsx');

var Welcome = module.exports = React.createClass({
  // Provides access to the router context object,
  // containing route-aware state (URL info etc.)
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [ListenerMixin, Navigation, TerminalCheck],

  getInitialState: function() {
    var checked = true;
    if(localStorage.getItem("welcomed")) {
      checked = false;
    }
    return {
      modalOpen: checked,
      classes: null
    };
  },

  componentWillMount: function() {
    var that = this;

    this.listenTo(classStore, this.classesUpdate, function(initialClasses) {
      that.setState({
        classes: initialClasses
      });
    });

    this.listenTo(rankStore, this.updateRanks, function(initialRanks) {
      that.updateRanks(initialRanks);
    });
  },

  classesUpdate: function(latestClasses) {
    this.setState({
      classes: latestClasses
    });
  },

  updateRanks: function(ranks) {
    var processedRanks = {};

    ranks.map(function(rank){
      processedRanks[rank._id] = rank.name;
    });

    this.setState({
      ranks: processedRanks
    });
  },

  componentDidMount: function() {
    localStorage.setItem("welcomed", "true");
  },

  handleHide: function() {
    this.setState({modalOpen: false});
  },

  render: function() {
    // Force a blank render to make the transition prettier
    if (this.props.terminalMode) {
      return (<div/>);
    }
    var currentGreeting = getGreetingTime(moment());
    var view;
    var that = this;
    var filteredClasses;
    var classRows;
    var startTime;
    var endTime;
    var key = 0;
    var today = moment().format("d");
    var thisHour = moment().subtract(1, "hours").format("HH:mm");

    // Moment uses "0" to represent Sunday instead of
    // "7" like we expect. Dirty hack to work around this:
    today = today === "0" ? "7" : today;

    // Filter the classes to only show ones in the same day and at the same time, or later
    filteredClasses = this.state.classes.filter(function(course) {
      return course.dayOfWeek == today && timeFormatting(course.startTime) >= thisHour;
    });

    classRows = filteredClasses.map(function(course, index) {
      var ranks = that.state.ranks;
      var rankName;
      var rankFromDb;

      rankFromDb = course.classType.split(',');
      startTime = timeFormatting(course.startTime);
      endTime = timeFormatting(course.endTime);

      Object.keys(ranks).map(function(rankId) {
        if(rankFromDb.length == 1){
          if (rankId == rankFromDb[0]) {
            rankName = ranks[rankId];
          }
        }
        else{
          for(var i=0;i<rankFromDb.length;i++){
            if (rankId == rankFromDb[i]){
              if(!rankName){
                rankName = ranks[rankId];
              }
              else {
                rankName = rankName + ", " +ranks[rankId];
              }
            }
          }
        }
      });

      return (
        <tr key={key++}>
          <td>{course.classTitle}</td>
          <td>{startTime} To {endTime} </td>
          <td className="rankName">{rankName}</td>
        </tr>
      );
    });

    if (this.state.modalOpen) {
      return (
        <div className="Welcome container">
          <Modal {...this.props} title='Welcome to Project Nariyuki - The OpenDojo CMS!'
            bsStyle='primary'
            animation={true}
            onRequestHide={this.handleHide}
          >
            <div className='modal-body'>
              <p>
                To get started, simply click on any one of the 6 modules on the left menu bar to see your
                latest lists of registered <strong>students</strong>, belt <strong>ranks</strong>, <strong>classes</strong>, or <strong>attendance</strong> schedules.
                You can also send e-mail <strong>notifications</strong>, or open up the mobile class check-in&nbsp;
                <strong>terminal</strong> at any time as well.
              </p>
              <p>
                For more information, simply click on "Extras" => "Usage Guide" on the top right of the app screen.
              </p>
            </div>
          </Modal>
        </div>
      );
    }

    else {
      if (filteredClasses.length == 0) {
        view = (
          <span><br />&nbsp;&nbsp;<Glyphicon glyph="eye-close" /> You do not seem to have any upcoming classes today...</span>
        );
      }
      else {
        view = (
          <Row>
            <Col md={3}>
              <small>Your upcoming classes for today are:</small>
            </Col>
            <Col md={6}>
              <Table striped>
                <thead>
                  <th>Class Title</th>
                  <th>Time</th>
                  <th>Class Type</th>
                </thead>
                <tbody>
                  {classRows}
                </tbody>
              </Table>
            </Col>
          </Row>
        );
      }

      return (
        <div className="Welcome container">
          <h2>Good {currentGreeting}!</h2>
          {view}
        </div>
      );
    }
  }
});
