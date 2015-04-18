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

var StudentView = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    //THIS NEEDS TO BE ERASED AFTER KIERAN DOES HIS SCREEN
    //this.props.routerParams.classID or studentID
    //for current db 
    //5532a49bec494b4844c41522 classID
    //5532a49bec494b4844c41526 studentID

    return {
      studentID: this.props.routerParams.studentID,
      classID: this.props.routerParams.classID,
      editable: false,
      valid: true,
    };
  },

  componentWillMount: function() {
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
    this.listenTo(attendanceActions.editAttendance.completed, this.editAttendanceComplete);
    this.listenTo(attendanceActions.editAttendance.failed, this.editAttendanceFailed);
  },

  showStudent: function(students) {
    var that = this;
    //This needs to be commented in LATER hard coding id for now
    //var id = this.props.routerParams.studentID;
    var id = "5532a49bec494b4844c41526";
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
    //This needs to be commented in LATER hard coding id for now
    //var id = this.props.routerParams.classID;
    var id = "5532a49bec494b4844c41525";
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
  editAttendanceComplete: function() {

  },
  editAttendanceFailed: function() {

  },
  // `EditStudent` Action Handling
  onEditStudent: function(e){debugger;
    if (e) { e.preventDefault(); }

    var that = this;
    var valid = true;

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
    // For now, input only accepts one email so we
    // stuff it into an array
    var emails = [this.refs.emails.getValue()];
    var newStudent = {
      _id: this.props.routerParams.id,
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      phone: this.refs.phone.getValue(),
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
  //This is meant to take it out of terminal mode
  changeMode: function() {debugger;
   localStorage.setItem("terminalMode", false);
   this.transitionTo('/app');
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
  saveAttendance: function() {debugger
    var today = new Date();
     var newAttendance = ({
        studentID: this.student._id,
        classDate: today,
        classTime: this.course.startTime,
        classID: this.course._id
      });
    attendanceActions.editAttendance(newAttendance);
  },
  render: function() {
    var content;
    var student = this.state.student;
    var checkinClass = this.state.course;
    var classDay;
    var classTime;
    var classTitle;
    if (checkinClass){
      classDay = this.getDay(checkinClass.dayOfWeek);
      classTime = timeFormatting(checkinClass.startTime);
      classTitle=checkinClass.classTitle;
    }
    var editable = this.state.editable;
    var settingMembership = this.state.settingMembership;
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
    var emails = "";
    student.email.forEach(function(email) {
      emails += email + " ";
    });
   
    var emergencyPhone = null;
  
   
    if(student.emergencyphone){
      emergencyPhone = (
        <div>
          Emergency Phone Number : {student.emergencyphone}
        </div>
      );
    }
    if(!editable){
      return (
        <div className="studentView container">
          <Table bordered={true} striped={true}>
            <tr>
               <th colSpan="4">Checking into: {
                classTitle + " " + classDay + ", " + classTime
              }</th>
            </tr>
            <tr>
              <th colSpan="4">Name: {
                student.firstName + " " + student.lastName
              }</th>
            </tr>
            <tr>
              <th>Phone:</th>
              <td colSpan="3">{student.phone}</td>
            </tr>
            <tr>
              <th>Emails:</th>
              <td colSpan="3">{emails}</td>
            </tr>
            <tr>
              <th>Guardian Information</th>
              <td colSpan="3">{student.guardianInformation}{emergencyPhone}
              </td>
            </tr>
            <tr>
              <th>Health Information</th>
              <td colSpan="3">{student.healthInformation}</td>
            </tr>
          </Table>
          <Grid>
            <Row className="show-grid">
             <Col xs={12} md={8}>
              <Button bsSize="large" bsStyle='primary' onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;
              <Button bsSize="large" onClick={this.changeMode}>Cancel</Button>
             </Col>
             <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" onClick={this.saveAttendance}>Checkin</Button></span></Col>
            </Row>
          </Grid>
        </div>
      );
    }
    if(editable && !settingMembership){
      return (
        <div className="studentView container">
          <form>
            <h2>Update Student Information:</h2>
            <Grid>
              <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}>
                  <FirstName label="First Name" ref="firstName" name="firstName" defaultValue={student.firstName} />
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
              <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}>
                  <LastName label="Last Name" ref="lastName" name="lastName" defaultValue={student.lastName} />
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
                <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}>
                  <PhoneInput label="Phone" ref="phone" name="phone" defaultValue={student.phone} />
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
               <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}> 
                  <EmailInput label="Emails" type="text" ref="emails" name="emails" defaultValue={emails} />
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
                <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}>
                  <GuardianInput label="Guardian Information" type="text" ref="guardian" name="guardian" defaultValue={student.guardianInformation} />
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
                <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}>
                  <PhoneInput label="Emergency Phone" ref="emergencyphone" name="emergencyphone" defaultValue={student.emergencyphone} />
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
                <Row className="show-grid">
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}>
                  <HealthInput label="Health Informaion" type="text" ref="healthinfo" name="healthinfo" defaultValue={student.healthInformation}/>
                </Col>
                <Col xs={6} sm={4}></Col>
              </Row>
            </Grid>
            <AlertDismissable visable={!this.state.valid} />
            <Grid>
              <Row className="show-grid">
                <Col xs={6} sm={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditStudent}>Save</Button></Col>
                <Col xs={6} sm={4}></Col>
                <Col xs={6} sm={4}><span className="pull-right"><Button bsSize="large" onClick={this.editToggle}>Cancel</Button></span></Col>
              </Row>
            </Grid>
          </form>
        </div>
      );
    }
  }
});
