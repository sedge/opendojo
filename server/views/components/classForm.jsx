/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var { ListenerMixin } = require('reflux');
var {
  Navigation,
  Link
} = require('react-router');

var { addClass } = require('../actions/classActions.jsx');

var ClassTitle = require('./classTitle.jsx');
var rankStore = require('../stores/rankStore.jsx');

var AlertDismissable = require('./alertDismissable.jsx');

var RankInput = require('./rankInputforClass.jsx');

var {
  Alert,
  Button,
  Input,
  Row,
  Col,
  Grid
} = require('react-bootstrap');

var ClassForm = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],

  getInitialState: function() {
    return {
      emptyvalid: true,
      valid: true,
      timeValid: true
    };
  },

  componentWillMount: function() {
    var that = this;

    this.listenTo(addClass.completed, this.addClassComplete);
    this.listenTo(addClass.failed, this.addClassFailed);

    // Listen for changes to class model state, immediately grabbing the most recent ranks
    // through the callback
    this.listenTo(rankStore, this.updateRanks, function(ranks) {
      that.updateRanks(ranks);
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

  timeValidation: function() { debugger;
    var start = this.refs.startTime.getValue();
    var end = this.refs.endTime.getValue();
    if(start.length > 1 && end.length > 1) {
      var startArray = start.split(":");
      var startHour = startArray[0];
      var startMinute = startArray[1];
      var endArray = end.split(":");
      var endHour = endArray[0];
      var endMinute = endArray[1];
      var startDate = new Date(1996, 6, 6, startHour, startMinute);
      var endDate = new Date(1996, 6, 6, endHour, endMinute);
      var threeHours = 1000 * 60 * 60 * 3;
      var fiveMinutes = 1000 * 300;

      if (Date.parse(startDate) >= Date.parse(endDate)
          || Date.parse(endDate) - Date.parse(startDate) > threeHours
          || Date.parse(endDate) - Date.parse(startDate) < fiveMinutes) {
        return this.setState({
          valid: false,
          timeValid: false
        })
      }
      if (!this.state.valid) {
        this.setState({
          valid: true
        });
      }
      if (!this.state.timeValid) {
        this.setState({
          timeValid: true
        });
      }
    }
    if (!this.state.valid) {
      this.setState({
        valid: true
      });
    }
    if (!this.state.timeValid) {
      this.setState({
        timeValid: true
      });
    }
  },

  validationState: function() {
    if (this.state.valid && this.state.timeValid) {
      return;
    }
    return "error";
  },

  handleSubmit: function(e) {
    if (e) { e.preventDefault(); }
    var that = this;
    console.log(this.refs.startTime);
    if(!this.refs.classTitle.getValue() ||
      !this.refs.day.getValue()||
      !this.refs.startTime.getValue()||
      !this.refs.endTime.getValue()||
      !this.refs.classtype.getValue()
    ){
      this.setState({
        emptyvalid: false
      });
    }
    else{
      addClass({
        classTitle:this.refs.classTitle.getValue().trim(),
        dayOfWeek:this.refs.day.getValue(),
        startTime:this.refs.startTime.getValue().trim(),
        endTime:this.refs.endTime.getValue().trim(),
        classType:this.refs.classtype.getValue()
      });
    }
  },

  addClassComplete: function() {
    this.transitionTo('/classes');
  },
  addClassFailed: function(err) {
    console.error('Adding a class failed: ', err);
    this.transitionTo('/classes');
  },

  render: function() {
    var emptyWarn;
    var submitButton;
    var timeFeedback;
    if(!this.state.timeValid) {
      timeFeedback = (
        <p><strong>The start time and end time of the class cannot be the same. A class must be at least 5 minutes long and 3 hours long at most.</strong></p>
      );
    }
    if (!this.state.emptyvalid) {
      emptyWarn = (
        <Alert bsStyle="danger" id="alert">
          <p><strong>Please fill in all of the required information</strong></p>
        </Alert>
      )
    }

    return (
      <div className="addClass container">
        <form>
          <h2> Enter new class information:</h2>
          <ClassTitle label="Class Title" ref="classTitle" name="classTitle" placeholder="Class Title" />
          <Input type="select" label="Day of Week" ref="day" name="day">
            <option value="" disabled defaultValue className="notDisplay">Select Day of Week</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </Input>
          <Input label="Class Time" wrapperClassName='wrapper'>
            <Row>
              <Col xs={6}>
                <Input type='time' label="From:" ref="startTime" name="startTime" onChange={this.timeValidation} bsStyle={this.validationState()} />
              </Col>
              <Col xs={6}>
                <Input type='time' label="To:" ref="endTime" name="endTime" onChange={this.timeValidation} bsStyle={this.validationState()} />
              </Col>
              {timeFeedback}
            </Row>

          </Input>
          <RankInput label="Class Type" ref="classtype" name="classtype" ranks={this.state.ranks} />

          <AlertDismissable visable={!this.state.valid} />
          {emptyWarn}
          <Grid>
            <Row className="show-grid">
             <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.handleSubmit}>Save</Button></Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}><span className="pull-right"><Link to="classes"><Button bsSize="large">Cancel</Button></Link></span></Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
});
