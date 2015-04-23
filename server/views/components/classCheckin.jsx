var React = require('react');
var Promise = require('bluebird');

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
  Input
} = require('react-bootstrap');

var {
  timeFormatting
} = require('../bin/utils.jsx');

var AlertDismissable = require('./alertDismissable.jsx');

var FirstName = require('./firstName.jsx');
var LastName = require('./lastName.jsx');
var PhoneInput = require('./phoneInput.jsx');
var EmailInput = require('./emailInput.jsx');
var GuardianInput = require('./guardianInput.jsx');
var HealthInput = require('./healthInput.jsx');

var ClassCheckIn = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      studentID: this.props.routerParams.studentID,
      classID: this.props.routerParams.classID,
      editable: false,
      valid: true,
      message:""
    };
  },

  componentWillMount: function() {
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }

    var that = this;

    // To pick the right student need to look through the current students
    this.listenTo(studentStore, this.showStudent, function(students) {
      that.showStudent(students);
    });

    // To pick the right class need to look through the current classes
    this.listenTo(classStore, this.showClass, function(classes) {
      that.showClass(classes);
    });

     // For edit succes vs failure for student edit and attendance generation
    this.listenTo(studentActions.editStudent.completed, this.editStudentComplete);
    this.listenTo(studentActions.editStudent.failed, this.editStudentFailed);
     
    this.listenTo(attendanceActions.addAttendance.completed, this.addAttendanceComplete);
    this.listenTo(attendanceActions.addAttendance.failed, this.addAttendanceFailed);
  },

  showStudent: function(students) {
    var that = this;

    var id = this.props.routerParams.studentID;
    students.forEach(function(student) {
      if (id == student._id) {
        that.setState({
          student: student
        });
      }
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
    //here it needs to transition to Kieran's screen

  },
  addAttendanceFailed: function() {
    console.error("adding an attendance failed: ", err);
    if(this.state.editable){
      this.setState({
        editable: false
      });
    }
  },
  // `EditStudent` Action Handling
  onEditStudent: function(e){debugger;
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
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      phone: this.refs.phone.getValue(),
      rankId: stu.rankId,
      gender: stu.gender,
      expiryDate: stu.expiryDate,
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
    var error = "Editing did not suceed";
    if(this.state.editable){
      this.setState({
        editable: false,
        message: error
      });
    }
  },
  editStudentComplete: function() {
    var success="Your information has been updated."
    if(this.state.editable){
      this.setState({
        message: success,
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
    var expiryDate;
    if (checkinClass){
      classDay = this.getDay(checkinClass.dayOfWeek);
      classTime = timeFormatting(checkinClass.startTime);
      classTitle=checkinClass.classTitle;
    }
    var editable = this.state.editable;
   
    if (!student) {
      return (
        <div className="studentView container">
          <Alert bsStyle="danger">
            The student associated with <strong>ID {this.props.routerParams.studentId}</strong> does not exist.
          </Alert>
        </div>
      );
    }
    if (!checkinClass) {
      return (
        <div className="studentView container">
          <Alert bsStyle="danger">
            The class associated with <strong>ID {this.props.routerParams.classID}</strong> does not exist.
          </Alert>
        </div>
      );
    }
    if (student && checkinClass)
    {
    var expiryDateUnmodified = student.membershipExpiry.split('T');
    var expiryDate = expiryDateUnmodified[0];
    var emails = "";
    student.email.forEach(function(email) {
      emails += email + " ";
    });
      return (
      <div className="studentView">
        <form>
          <Row className="show-grid">
            <Col xs={18} sm={12}></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={18} md={12}>
              <span className="pull-left">
                  <Link to="terminal">
                    <Button bsSize="large">Back</Button>
                  </Link>
              </span>
              <span className="pull-right">
                  <Link to="terminal">
                    <Button bsSize="large" onClick={this.saveAttendance}>Check-in</Button>
                  </Link>
              </span>
            </Col>
          </Row>
          <h2><b>Checking into: {
              classTitle + " " + classDay + ", " + classTime
            }
          </b></h2>
          <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>First Name:</Col>
            <Col xs={6} sm={4}>
              <FirstName ref="firstName" name="firstName" readOnly={!this.state.editable} defaultValue={student.firstName} />
            </Col>
             <Col xs={6} sm={4}></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Last Name:</Col>
            <Col xs={6} sm={4}>
              <LastName ref="lastName" name="lastName" readOnly={!this.state.editable} defaultValue={student.lastName} />
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
            <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Phone:</Col>
            <Col xs={6} sm={4}>
              <PhoneInput ref="phone" name="phone" readOnly={!this.state.editable} defaultValue={student.phone} />
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
           <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Emails:</Col>
            <Col xs={6} sm={4}>
              <EmailInput type="text" ref="emails" name="emails" readOnly={!this.state.editable} defaultValue={emails} />
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
            <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Guardian Information:</Col>
            <Col xs={6} sm={4}>
              <GuardianInput type="text" ref="guardian" readOnly={!this.state.editable} name="guardian" defaultValue={student.guardianInformation} />
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
            <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Emergency Phone:</Col>
            <Col xs={6} sm={4}>
              <PhoneInput ref="emergencyphone" readOnly={!this.state.editable} name="emergencyphone" defaultValue={student.emergencyphone} />
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Health Information:</Col>
            <Col xs={6} sm={4}>
              <HealthInput type="text" ref="healthinfo" readOnly={!this.state.editable} name="healthinfo" defaultValue={student.healthInformation}/>
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={6} className="rightLabel" sm={4}>Your membership expires on:</Col>
            <Col xs={6} sm={4} className="red">
              {expiryDate}
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
          <AlertDismissable visable={!this.state.valid} />
          <Row className="show-grid">
            <Col xs={6} sm={4}></Col>
            <Col xs={6} md={4} className="red">
               {this.state.message}
            </Col>
            <Col xs={6} sm={4}></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={8}>
              <Button bsSize="large" bsStyle='primary' disabled={this.state.editable} onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;
              <Button bsSize="large" disabled={!this.state.editable} onClick={this.editToggle}>Cancel</Button>
            </Col>
            <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" bsStyle='primary' disabled={!this.state.editable} onClick={this.onEditStudent}>Save</Button></span></Col>
          </Row>
        </form>
      </div>
      );
    }
  }
});
