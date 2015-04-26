var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var {
  ListenerMixin
} = Reflux;

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var RouteHandler = Router.RouteHandler;
//   ...
var {
  RouteHandler,
  Navigation
} = Router;

var {
  sortByKey
} = require('../bin/utils.jsx');

var studentStore = require('../stores/studentStore.jsx');
var classStore = require('../stores/classStore.jsx');
var messageStore = require('../stores/messageStore.jsx');

var {
  Grid,
  Row,
  Col,
  Button,
  Nav,
  Navbar,
  NavItem
} = require('react-bootstrap');

var Terminal = React.createClass({
  // Provides access to the router context object,
  // containing route-aware state (URL info etc.)
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Navigation,
    Reflux.connectFilter(studentStore, "students", function(students) {
      var filteredStudents = students.map(function(student){
        return {
          _id: student._id,
          name: student.lastName + ", " + student.firstName
        };
      });

      // We ensure the array of students is pre-sorted by name
      // before we return it
      return filteredStudents.sort(sortByKey("name", 0));
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
    }),
    Reflux.connect(messageStore, "message")
  ],

  componentWillMount: function() {
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    var handlerProps = {
      terminalMode: this.props.terminalMode,
      routerParams: this.props.routerParams,
      students: this.state.students,
      classes: this.state.classes
    };
    var customMessage = "";

    if (this.state.message && this.state.message.length > 0) {
      customMessage = this.state.message[0].messageText;
    }

    return (
      <div id="terminal">
        <Grid fluid>
          <Navbar fixedTop fluid>
            <Row>
              <Col md={12}>
                <Button bsStyle="danger" block>
                  {customMessage}
                </Button>
              </Col>
            </Row>
          </Navbar>
          <Row>
            <Col sm={12}>
              <RouteHandler {...handlerProps} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

module.exports = Terminal;
