var React = require("react");
var Reflux = require("reflux");

var { Navigation } = require("react-router");

var $ = require('zeptojs');
var moment = require('moment');

var {
  timeFormatting,
  momentForTime
} = require('../bin/utils.jsx');

var {
  Row,
  Col,
  Input,
  Button
} = require('react-bootstrap');

var Timestamp = require('./timestamp.jsx');

var ClassPicker = module.exports = React.createClass({
  mixins: [Navigation],
  getInitialState: function() {
    return {
      endOfDay: false
    };
  },

  updateCurrentClass: function(course) {
    var that = this;
    return function() {
      that.setState({
        currentCourse: course
      });
    };
  },

  setTimers: function(classes) {
    var that = this;
    var timeouts = [];

    // Represents how early a student can check-in to class
    var earlyCheckInWindow = 15;

    var today = moment().format("d");

    var now = moment();
    var timeNow = now.format("HH:mm");

    // Determine the classes for the day, from this moment
    var filteredClasses = classes.filter(function(course) {
      var endTime = timeFormatting(course.endTime);

      if (course.dayOfWeek != today) {
        return false;
      }
      if (timeNow >= endTime) {
        return false;
      }
      return true;
    });

    // Set up component rerendering as each class occurs
    filteredClasses.forEach(function(course) {
      var start = momentForTime(course.startTime);
      var end = momentForTime(course.endTime);

      var timeToStart;

      // If the class is in progress, but not over, make it display immediately
      if (start.format("HH:mm") <= timeNow && timeNow <= end.format("HH:mm")) {
        timeToStart = 0;
      } else {
        timeToStart = start.subtract(earlyCheckInWindow, "minutes").valueOf() - now.valueOf() ;
      }

      // Must be updating to next class with current class's end time
      var timeoutKey = setTimeout(that.updateCurrentClass(course), timeToStart);

      // This tracks timeouts so we can disable them when shifting views
      timeouts.push(timeoutKey);
    });

    var finalClass = filteredClasses[filteredClasses.length - 1];
    var finalEndTime = momentForTime(finalClass.endTime).subtract(earlyCheckInWindow, "minutes");
    var timeToEnd = finalEndTime.valueOf() - now.valueOf();

    // Add end of day flag after final class
    timeouts.push(setTimeout(function() {
      that.setState({
        endOfDay: true
      })
    }, timeToEnd));

    this.setState({
      timeouts: timeouts,
      filteredClasses: filteredClasses
    });
  },

  componentWillReceiveProps: function(newProps) {
    this.componentWillUnmount();

    this.setTimers(newProps.classes);
  },
  componentWillUnmount: function() {
    if (this.state.timeouts) {
      this.state.timeouts.forEach(function(timeoutKey) {
        clearTimeout(timeoutKey);
      });
    }
  },
  proceedToCheckIn: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    var students = this.refs.students;
    var classes = this.refs.classes;

    var studentSelection = students.getValue();
    var classSelection = classes.getValue();

    this.transitionTo('checkIn', {
      classID: classSelection,
      studentID: studentSelection
    });
  },
  render: function() {
    var classes = this.props.classes;
    var students = this.props.students;

    var currentCourse = this.state.currentCourse;
    var timeouts = this.state.timeouts;

    if (!students.length || !classes.length) {
      return (
        <div id='classPicker' />
      );
    }

    if (this.state.endOfDay) {
      return (
        <div id='classPicker'>
          <h3><strong>Tomorrow's a new day!</strong></h3>
          <p>Today's classes are done. Rest up, you've earned it!</p>
        </div>
      );
    }

    if (!currentCourse && !(timeouts && timeouts.length > 0)) {
      return (
        <div id='classPicker'>
          <Timestamp />
          <h3>There are no classes today!</h3>
        </div>
      );
    }

    if (!currentCourse) {
      classes = this.state.filteredClasses;

      var startTime = timeFormatting(classes[0].startTime);
      var timeAsMoment = momentForTime(startTime);
      var className = classes[0].title;

      return (
        <div id='classPicker'>
          <Timestamp />
          <p>Check-in for {className} will open at <strong>{timeAsMoment.subtract(15, "minutes").format("HH:mm")}</strong></p>
        </div>
      );
    }

    var studentKey = 0;
    var studentOptions = students.map(function(student) {
      return (
        <option key={studentKey++} value={student._id}>{student.name}</option>
      );
    });

    return (
      <div id='classPicker'>
        <Timestamp courseTitle={currentCourse.title} courseTime={timeFormatting(currentCourse.startTime)}/>
        <Row>
          <Col>
            <Input type="select" label="Select Student:" ref="students" name="students">
              {studentOptions}
            </Input>
            <Input type="select" label="Select Class:" defaultValue={currentCourse._id} ref="classes" name="classes">
              <option value={currentCourse._id}>{currentCourse.title}</option>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button bsSize="large" bsStyle='primary' onClick={this.proceedToCheckIn}>Proceed to check-in</Button>
          </Col>
        </Row>
      </div>
    );
  }
});
