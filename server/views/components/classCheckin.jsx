/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var Promise = require('bluebird');

var Timestamp = require('./timestamp.jsx');

var { ListenerMixin } = require('reflux');
var {
  Navigation,
  Link
} = require('react-router');

var studentStore = require('../stores/studentStore.jsx');
var studentActions = require('../actions/studentActions.jsx');
var classStore = require('../stores/classStore.jsx');
var attendanceStore = require('../stores/attendanceStore.jsx');
var attendanceActions = require('../actions/attendanceActions.jsx');

var {
  Alert,
  Table,
  Button,
  Grid,
  Col,
  Row,
  Input,
  Navbar,
  Jumbotron
} = require('react-bootstrap');

var {
  timeFormatting,
  membershipStatusCalculator
} = require('../bin/utils.jsx');

var AlertDismissable = require('./alertDismissable.jsx');

var FirstName = require('./firstName.jsx');
var LastName = require('./lastName.jsx');
var PhoneInput = require('./phoneInput.jsx');
var EmailInput = require('./emailInput.jsx');
var GuardianInput = require('./guardianInput.jsx');
var HealthInput = require('./healthInput.jsx');

var ClassCheckIn = module.exports = React.createClass({
  // Provides access to the router context object,
  // containing route-aware state (URL info etc.)
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      studentID: this.props.routerParams.studentID,
      classID: this.props.routerParams.classID,
      editable: false,
      valid: true,
      expired: false
    };
  },

  componentWillMount: function() {
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }

    var that = this;

    // Listen for changes to student model state, immediately showing the latest students
    // through the callback
    this.listenTo(studentStore, this.showStudent, function(students) {
      that.showStudent(students);
    });

    this.listenTo(classStore, this.showClass, function(classes) {
      that.showClass(classes);
    });


    this.listenTo(studentActions.editStudent.completed, this.editStudentComplete);
    this.listenTo(studentActions.editStudent.failed, this.editStudentFailed);
      // For edit succes vs failure
    this.listenTo(attendanceActions.addAttendance.completed, this.addAttendanceComplete);
    this.listenTo(attendanceActions.addAttendance.failed, this.addAttendanceFailed);
  },

  showStudent: function(students) {
    var that = this;
    var student;

    var id = this.props.routerParams.studentID;
    students.forEach(function(person) {
      if (id == person._id) {
        student = person;
      }
    });

    var expired = false;
    if (student) {
      expired = this.calculateExpiry(student).indexOf('Expired') !== -1;
    }

    this.setState({
      student: student,
      expired: expired
    });
  },
  showClass: function(classes) {
    var that = this;

    var id = this.props.routerParams.classID;
    classes.forEach(function(course) {
      if (id == course._id) {
        that.setState({
          course: course
        });
      }
    });
  },
  editToggle: function(e){
    e.preventDefault();
    this.setState({
      editable : !this.state.editable
    });
  },
  addAttendanceComplete: function() {
    this.transitionTo("classPicker");
  },
  addAttendanceFailed: function() {
    console.error("adding an attendance failed: ", err);
    if(this.state.editable){
      this.setState({
        editable: false
      });
    }
  },

  onEditStudent: function(e){
    if (e) { e.preventDefault(); }

    var that = this;
    var valid = true;
    var stu = this.state.student;

    var keys = Object.keys(this.refs);
    keys.forEach(function(ref) {
      var child = that.refs[ref];

      // Is it in a valid state?
      if (!child.state.valid) {
        valid = false;
      }
    });

    if (!valid) {
      // Show alert
      this.setState({
        valid: false
      });
      return;
    }

    this.setState({
      valid: true
    });

    var emails = [this.refs.emails.getValue()];
    var newStudent = {
      _id: this.props.routerParams.studentID,
      firstName: stu.firstName,
      lastName: stu.lastName,
      phone: this.refs.phone.getValue(),
      rankId: stu.rankId,
      gender: stu.gender,
      membershipExpiry: stu.membershipExpiry,
      birthDate: stu.birthDate,
      guardianInformation: this.refs.guardian.getValue(),
      healthInformation: this.refs.healthinfo.getValue(),
      email: emails,
      emergencyphone: this.refs.emergencyphone.getValue()
    };
    studentActions.editStudent(newStudent);
  },

  editStudentFailed:function(err) {
    console.error("Editing a student failed: ", err);
    if(this.state.editable){
      this.setState({
        editable: false
      });
    }
  },
  editStudentComplete: function() {
    if(this.state.editable){
      this.setState({
        editable: false
      });
    }
  },
  getDay: function(day){
    var dayOfWeek;
    switch(day){
      case 1:
        dayOfWeek="Monday"
        break;
      case 2:
        dayOfWeek="Tuesday"
        break;
      case 3:
        dayOfWeek="Wednesday"
        break;
      case 4:
        dayOfWeek="Thursday"
        break;
      case 5:
        dayOfWeek="Friday"
        break;
      case 6:
        dayOfWeek="Saturday"
        break;
      case 7:
        dayOfWeek="Sunday"
        break;
      default:
        dayOfWeek=""
        break;
    }
    return dayOfWeek;
  },
  saveAttendance: function() {
    var today = new Date();
    var stu = this.state.student;
    var cls = this.state.course;
    var newAttendance = ({
      studentID: stu._id,
      classDate: today,
      classTime: cls.startTime,
      classID: cls._id
    });
    attendanceActions.addAttendance(newAttendance);
  },
  backToClassPicker: function() {
    this.transitionTo('classPicker');
  },
  calculateExpiry: function(student) {
    student = student || this.state.student;

    if (!student) {
      return;
    }

    var expiryObject = student.membershipExpiry;
    var expiryDate = expiryObject.split("T")[0]

    var valid = membershipStatusCalculator(expiryObject).indexOf('Available') !== -1;

    if (!valid) {
      return "Expired! Talk to Sensei before class!";
    } else {
      return expiryDate;
    }

  },
  render: function() {
    // Force a blank render to make the transition prettier
    if (!this.props.terminalMode) {
      return (<div/>);
    }

    var content;
    var student = this.state.student;
    var checkinClass = this.state.course;
    var classDay;
    var classTime;
    var classTitle;
    var checkInButton;

    if (checkinClass){
      classDay = this.getDay(checkinClass.dayOfWeek);
      classTime = timeFormatting(checkinClass.startTime);
      classTitle=checkinClass.classTitle;
    }
    var editable = this.state.editable;
    var settingMembership = this.state.settingMembership;
    if (!student) {
      return (
        <div className="terminal">
          <Alert bsStyle="danger">
            The student associated with <strong>ID {this.props.routerParams.studentId}</strong> does not exist.
          </Alert>
        </div>
      );
    }
    if (!checkinClass) {
      return (
        <div className="terminal">
          <Alert bsStyle="danger">
            The class associated with <strong>ID {this.props.routerParams.classID}</strong> does not exist.
          </Alert>
        </div>
      );
    }
    var emails = "";
    student.email.forEach(function(email) {
      emails += email + " ";
    });

    if (this.state.expired || editable) {
      checkInButton = (
        <div />
      );
    } else {
      checkInButton = (
        <Button bsStyle="success" block onClick={this.saveAttendance}>
          Confirm Check-in
        </Button>
      );
    }

    if(!editable){
      return (
        <div className="terminal">
          <Navbar fixedBottom fluid>
            <Row>
              <Col md={4}>
                <Button block onClick={this.backToClassPicker}>
                  Go Back
                </Button>
              </Col>
              <Col md={4}>
                <Timestamp id="navbar-timestamp" />
              </Col>
              <Col md={4}>
                {checkInButton}
              </Col>
            </Row>
          </Navbar>

          <Jumbotron>
            <Row id="single-student">
              <Table>
                <tr>
                  <th colSpan="4">Name: <span>{
                    student.firstName + " " + student.lastName
                  }</span></th>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td colSpan="3">
                    <Input disabled type="text" value={student.phone} />
                  </td>
                </tr>
                <tr>
                  <th>Emails:</th>
                  <td colSpan="3"><Input disabled type="text" value={emails} /></td>
                </tr>
                <tr>
                  <th>Guardian Information</th>
                  <td colSpan="3">
                    <Input disabled type="text" value={student.guardianInformation} />
                  </td>
                </tr>
                <tr>
                  <th>Emergency Phone:</th>
                  <td colSpan="3">
                    <Input disabled type="text" value={student.emergencyphone} />
                  </td>
                </tr>
                <tr>
                  <th>Health Information</th>
                  <td colSpan="3">
                    <Input disabled type="text" value={student.healthInformation} />
                  </td>
                </tr>
              </Table>
              <Row>
               <Col id="expiryDate" md={8}>
                  Your membership expires on: <br />
                  <Button bsStyle='primary'>{this.calculateExpiry()}</Button>&nbsp;&nbsp;
               </Col>
               <Col md={3}>
                <br />
                <Button block bsSize="large" bsStyle='primary' onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;
               </Col>
              </Row>
            </Row>
          </Jumbotron>
        </div>
      );
    }
    if(editable && !settingMembership){
      return (
        <div className="terminal">
          <Navbar fixedBottom fluid>
            <Row>
              <Col md={4}>
                <Button block onClick={this.backToClassPicker}>
                  Go Back
                </Button>
              </Col>
              <Col md={4}>
                <Timestamp id="navbar-timestamp" />
              </Col>
              <Col md={4}>
                {checkInButton}
              </Col>
            </Row>
          </Navbar>

          <Jumbotron>
            <Row id="single-student">
              <Table>
                <tr>
                  <th colSpan="4">Name: <span>{
                    student.firstName + " " + student.lastName
                  }</span></th>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td colSpan="3">
                    <PhoneInput ref="phone" name="phone" defaultValue={student.phone} />
                  </td>
                </tr>
                <tr>
                  <th>Emails:</th>
                  <td colSpan="3">
                    <EmailInput type="text" ref="emails" name="emails" defaultValue={emails} />
                  </td>
                </tr>
                <tr>
                  <th>Guardian Information</th>
                  <td colSpan="3">
                    <GuardianInput type="text" ref="guardian" name="guardian" defaultValue={student.guardianInformation} />
                  </td>
                </tr>
                <tr>
                  <th>Emergency Phone:</th>
                  <td colSpan="3">
                    <PhoneInput ref="emergencyphone" name="emergencyphone" defaultValue={student.emergencyphone} />
                  </td>
                </tr>
                <tr>
                  <th>Health Information</th>
                  <td colSpan="3">
                    <HealthInput type="text" ref="healthinfo" name="healthinfo" defaultValue={student.healthInformation}/>
                  </td>
                </tr>
              </Table>
              <Row>
               <Col id="expiryDate" md={8}>
                  Your membership expires on: <br />
                  <Button bsStyle='primary'>{this.calculateExpiry()}</Button>&nbsp;&nbsp;
               </Col>
               <Col md={3}>
                <br />
                <Button block bsSize="large" bsStyle='success' onClick={this.onEditStudent}>Save</Button>&nbsp;&nbsp;
               </Col>
              </Row>
            </Row>
          </Jumbotron>
        </div>
      );
    }
  }
});
