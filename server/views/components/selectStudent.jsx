var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

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
  Button,
  Input
} = require('react-bootstrap');

var studentStore = require('../stores/studentStore.jsx');
var classStore = require('../stores/classStore.jsx');

var SelectStudent = React.createClass({
  mixins: [
    Navigation,
    Reflux.connectFilter(studentStore, "students", function(students) {
      var processedStudents = {};

      students.map(function(student){
        processedStudents[student._id] = student.lastName + ", " + student.firstName;
      });

      return processedStudents;
    }),
    Reflux.connectFilter(classStore, "classes", function(classes) {
      var processedClasses = {};

      classes.map(function(course){
        processedClasses[course._id] = course.classTitle;
      });

      return processedClasses;
    })
  ],

  componentWillMount: function() {
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }
  },

  getInitialState: function() {
    return {}
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
    var students = this.state.students;
    var classes = this.state.classes;

    var studentOptions = [];
    var classOptions = [];

    Object.keys(students).forEach(function(studentId) {
      studentOptions.push((
        <option value={studentId}>{students[studentId]}</option>
      ));
    });

    Object.keys(classes).forEach(function(classId) {
      classOptions.push((
        <option value={classId}>{classes[classId]}</option>
      ));
    });

    return (
      <div id="terminal">
        <Row>
          <Col>
            <Input type="select" label="Select Student:" ref="students" name="students">
              {studentOptions}
            </Input>
            <Input type="select" label="Select Class:" ref="classes" name="classes">
              {classOptions}
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

module.exports = SelectStudent;
