var React = require("react");
var Reflux = require("reflux");

var $ = require('zeptojs');
var moment = require('moment');

var { blacklist } = require('validator');

var authStore = require('../stores/authStore.jsx');
var authActions = require('../actions/authActions.jsx');

var { Navigation } = require("react-router");

var {
  timeFormatting,
  momentForTime
} = require('../bin/utils.jsx');

var {
  Row,
  Col,
  Input,
  Button,
  Jumbotron,
  Navbar,
  Table,
  Panel
} = require('react-bootstrap');

var Timestamp = require('./timestamp.jsx');

function filterByName(students, name) {
  if (!name || blacklist(name, " ").length === 0) {
    return students;
  }

  var filteredStudents = [];

  students.forEach(function(person){
    if(person.name.toLowerCase().indexOf(name.toLowerCase())!== -1)
      filteredStudents.push(person);
  });

  return filteredStudents;
}

var ClassPicker = module.exports = React.createClass({
  mixins: [Navigation],
  getInitialState: function() {
    return {
      endOfDay: false,
      searchResults: []
    };
  },

  doSearch: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    var name = this.refs.search.getValue();

    this.setState({
      search: name
    });
  },

  updateCurrentClass: function(course) {
    var that = this;
    return function() {
      that.setState({
        currentCourse: course
      });
    };
  },

  returnToDashboard: function() {
    authActions.validate(this.refs.password.getValue());
  },

  setTimers: function(classes) {
    var that = this;
    var timeouts = [];

    // Represents how early a student can check-in to class
    var earlyCheckInWindow = 15;

    var today = moment().format("d");

    // Moment uses "0" to represent Sunday instead of
    // "7" like we expect. Dirty hack to work around this:
    today = today === "0" ? "7" : today;

    var now = moment().hours(16).minutes(15);
    var timeNow = now.format("HH:mm");

    // Bail out early if there are no classes
    if (classes.length === 0) {
      return;
    }

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

    if (filteredClasses.length === 0) {
      return;
    }

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
  componentWillMount: function(){
    this.componentWillUnmount();

    this.setTimers(this.props.classes);
  },
  componentWillUnmount: function() {
    if (this.state.timeouts) {
      this.state.timeouts.forEach(function(timeoutKey) {
        clearTimeout(timeoutKey);
      });
    }
  },
  proceedToCheckIn: function(studentID) {
    var that = this;

    return function(e) {
      if (e && e.preventDefault) e.preventDefault();

      that.transitionTo('checkIn', {
        classID: that.state.currentCourse._id,
        studentID: studentID
      });
    }
  },
  render: function() {
    var that = this;

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
          <Navbar fixedBottom fluid>
            <Col md={2}>
              <Button bsStyle="primary" block onClick={this.returnToDashboard}>
                Dashboard
              </Button>
            </Col>
            <Col md={3}>
              <Input type="password" placeholder="Password" ref="password" />
            </Col>
          </Navbar>
          <Jumbotron>
            <h3><strong>Tomorrow's a new day!</strong></h3>
            <p>Today's classes are done. Rest up, you've earned it!</p>
          </Jumbotron>
        </div>
      );
    }

    if (!currentCourse && !(timeouts && timeouts.length > 0)) {
      return (
        <div id='classPicker'>
          <Navbar fixedBottom fluid>
            <Col md={2}>
              <Button bsStyle="primary" block onClick={this.returnToDashboard}>
                Dashboard
              </Button>
            </Col>
            <Col md={3}>
              <Input type="password" placeholder="Password" ref="password" />
            </Col>
          </Navbar>
          <Jumbotron>
            <Timestamp />
            <h3>There are no classes today!</h3>
          </Jumbotron>
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
          <Navbar fixedBottom fluid>
            <Col md={2}>
              <Button bsStyle="primary" block onClick={this.returnToDashboard}>
                Dashboard
              </Button>
            </Col>
            <Col md={3}>
              <Input type="password" placeholder="Password" ref="password" />
            </Col>
          </Navbar>

          <Jumbotron>
            <Timestamp />
            <p>Check-in for {className} will open at <strong>{timeAsMoment.subtract(15, "minutes").format("HH:mm")}</strong></p>
          </Jumbotron>
        </div>
      );
    }

    students = filterByName(students, this.state.search);

    var searchResults = students.map(function(student) {
      var buttonProps = {
        key: student._id,
        onClick: that.proceedToCheckIn(student._id),
        bsStyle: 'warning',
        block: true
      };
      var button = (
        <Button {...buttonProps}>
          Check In
        </Button>
      );

      return (
        <tr key={student._id}>
          <td><span>{student.name}</span></td>
          <td>{button}</td>
        </tr>
      );
    });

    return (
      <div id='classPicker'>
        <Navbar fixedBottom fluid>
          <Row>
            <Col md={2}>
              <Button bsStyle="primary" block onClick={this.returnToDashboard}>
                Dashboard
              </Button>
            </Col>
            <Col md={3}>
              <Input type="password" placeholder="Password" ref="password" />
            </Col>
            <Col md={5}>
              <Button id="titleBlock" block>{this.state.currentCourse.title}</Button>
            </Col>
            <Col md={2}>
              <Button block>@ {timeFormatting(this.state.currentCourse.startTime)}</Button>
            </Col>
          </Row>
        </Navbar>

        <Jumbotron>
          <Row>
            <Col>
              <Timestamp contents={"Checking in?"} />
            </Col>
          </Row>
          <Row>
            <Panel header={(
              <Row id="checkinSearch">
                <Col md={12}>
                  <Input onChange={this.doSearch} type="text" ref="search" placeholder="Search by name" />
                </Col>
              </Row>
            )}>
              <Col>
                <Table>
                  <tbody>
                    {searchResults}
                  </tbody>
                </Table>
              </Col>
            </Panel>
          </Row>
        </Jumbotron>
      </div>
    );
  }
});
