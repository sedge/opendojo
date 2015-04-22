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
  Jumbotron
} = require('react-bootstrap');

var {
  timeFormatting,
  sortByKey,
  momentForTime,
  timeToMilliseconds
} = require('../bin/utils.jsx');

var studentStore = require('../stores/studentStore.jsx');
var classStore = require('../stores/classStore.jsx');

var ClassPicker = require('./classPicker.jsx')

var SelectStudent = React.createClass({
  mixins: [
    Navigation,
    Reflux.connectFilter(studentStore, "students", function(students) {
      return students.map(function(student){
        return {
          _id: student._id,
          name: student.lastName + ", " + student.firstName
        };
      });
    }),
    Reflux.connectFilter(classStore, "classes", function(classes) {
      var processedClasses = [];

      classes.map(function(course){
        processedClasses.push({
          _id: course._id,
          title: course.classTitle,
          startTime: course.startTime,
          endTime: course.endTime,
          dayOfWeek: course.dayOfWeek
        });
      });

      processedClasses.sort(sortByKey("startTime", 0));

      return processedClasses;
    })
  ],

  componentWillMount: function() {
    // Prevent the view from rendering if it isn't in
    // terminal mode
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }
  },

  render: function() {
    var students = this.state.students;
    var classes = this.state.classes;

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
        <Row>
          <Col>
            <Jumbotron>
              <ClassPicker students={students} classes={classes} />
            </Jumbotron>
          </Col>
        </Row>
      </div>
    );
  }
});

module.exports = SelectStudent;
