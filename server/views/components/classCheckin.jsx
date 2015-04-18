var React = require('react');
var Promise = require('bluebird');

var { ListenerMixin } = require('reflux');
var {
  Navigation,
  Link
 } = require('react-router');

var studentStore = require('../stores/studentStore.jsx');
var studentActions = require('../actions/studentActions.jsx');
var messageStore = require('../stores/messageStore.jsx');
var messageActions = require('../actions/messageActions.jsx');

var {
  Alert,
  Table,
  Button,
  Grid,
  Col,
  Row,
  Input
} = require('react-bootstrap');

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
    return {
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

    // Reflux can probably do this for us automatically, especially if we
    // use promise objects
    this.listenTo(studentActions.editStudent.completed, this.editStudentComplete);
    this.listenTo(studentActions.editStudent.failed, this.editStudentFailed);
  },

  showStudent: function(students) {
    var that = this;
    var id = that.props.routerParams.id;

    students.forEach(function(student) {
      if (id == student._id) {
        that.setState({
          student: student
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

  // `EditStudent` Action Handling
  onEditStudent: function(e){
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
  render: function() {
    var content;
    var student = this.state.student;
    var editable = this.state.editable;
    var settingMembership = this.state.settingMembership;
    if (!student) {
      return (
        <div className="studentView container">
          <Alert bsStyle="danger">
            The student associated with <strong>ID {this.props.routerParams.id}</strong> does not exist.
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
              <th colSpan="4">Viewing: {
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
             <Col xs={12} md={8}><Button bsSize="large" bsStyle='primary' onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;</Col>
             <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" onClick={this.editToggle}>Checkin</Button></span></Col>
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
            <FirstName label="First Name" ref="firstName" name="firstName" defaultValue={student.firstName} />
            <LastName label="Last Name" ref="lastName" name="lastName" defaultValue={student.lastName} />
            <PhoneInput label="Phone" ref="phone" name="phone" defaultValue={student.phone} />
            <EmailInput label="Emails" type="text" ref="emails" name="emails" defaultValue={emails} />
            <GuardianInput label="Guardian Information" type="text" ref="guardian" name="guardian" defaultValue={student.guardianInformation} />
            <PhoneInput label="Emergency Phone" ref="emergencyphone" name="emergencyphone" defaultValue={student.emergencyphone} />
            <HealthInput label="Health Informaion" type="text" ref="healthinfo" name="healthinfo" defaultValue={student.healthInformation}/>

            <AlertDismissable visable={!this.state.valid} />
            <Grid>
              <Row className="show-grid">
               <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditStudent}>Save</Button></Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" onClick={this.editToggle}>Cancel</Button></span></Col>
              </Row>
            </Grid>
          </form>
        </div>
      );
    }
  }
});
