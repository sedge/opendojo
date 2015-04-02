var React = require('react');
var Promise = require('bluebird');

var { ListenerMixin } = require('reflux');
var { 
  Navigation,
  Link
 } = require('react-router');

var studentStore = require('../stores/studentStore.jsx');
var studentActions = require('../actions/studentActions.jsx');

var rankStore = require('../stores/rankStore.jsx');

var {
  Alert,
  Table,
  Button,
  Grid,
  Col,
  Row
} = require('react-bootstrap');

var AlertDismissable = require('./alertDismissable.jsx');

var {
  ageCalculator,
  membershipStatusCalculator,
  bdateForEdit
} = require('../bin/utils.jsx');

var FirstName = require('./firstName.jsx');
var LastName = require('./lastName.jsx');
var RankInput = require('./rankInput.jsx');
var GenderInput = require('./genderInput.jsx');
var DateInput = require('./dateInput.jsx');
var PhoneInput = require('./phoneInput.jsx');
var EmailInput = require('./emailInput.jsx');
var GuardianInput = require('./guardianInput.jsx');
var HealthInput = require('./healthInput.jsx');

var StudentView = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      editable: false,
      valid: true
    };
  },

  componentWillMount: function() {
    var that = this;

    // Listen for changes to student model state, immediately showing the latest students
    // through the callback
    this.listenTo(studentStore, this.showStudent, function(students) {
      that.showStudent(students);
    });

    // Listen for changes to student model state, immediately grabbing the most recent ranks
    // through the callback
    this.listenTo(rankStore, this.updateRanks, function(ranks) {
      that.updateRanks(ranks);
    });

    // Reflux can probably do this for us automatically, especially if we
    // use promise objects
    this.listenTo(studentActions.deleteStudent.completed, this.deleteStudentComplete);
    this.listenTo(studentActions.deleteStudent.failed, this.deleteStudentFailed);
    this.listenTo(studentActions.editStudent.completed, this.editStudentComplete);
    this.listenTo(studentActions.editStudent.failed, this.editStudentFailed);
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
      rankId: this.refs.rank.getValue(),
      birthDate: this.refs.bday.getValue(),
      gender: this.refs.gender.getValue(),
      guardianInformation: this.refs.guardian.getValue(),
      healthInformation: this.refs.healthinfo.getValue(),
      email: emails,
      emergencyphone: this.refs.emergencyphone.getValue()
    };
    studentActions.editStudent(newStudent);
  },
  editStudentFailed:function(err) {
    console.error("Editing a student failed: ", err);
    this.setState({
      editable: false
    });
  },
  editStudentComplete: function() {
    this.setState({
      editable: false
    });
  },

  // `DeleteStudent` Action Handling
  onDeleteStudent: function(e){
    var deleteStudent = confirm("Do you want to delete the student?");
    if (deleteStudent){
      studentActions.deleteStudent(this.props.routerParams.id);
    }
  },
  deleteStudentComplete: function(students) {
    this.transitionTo("students");
  },
  deleteStudentFailed: function(students) {
    console.error("Deleting a student failed: ", err);
    this.transitionTo("students");
  },

  render: function() {
    var content;
    var student = this.state.student;
    var editable = this.state.editable;

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
    var age = ageCalculator(student.birthDate);
    var membershipStatus = membershipStatusCalculator(student.membershipExpiry);
    var editBdate = bdateForEdit(student.birthDate);
    var ranks = this.state.ranks;
    var rankName;
    var emergencyPhone = null;
    Object.keys(ranks).map(function(rankId) {
      if (rankId == student.rankId) {
        rankName = ranks[rankId];
      }
    });
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
              <th>Rank:</th>
              <td colSpan="3">{rankName || "No rank assigned"}</td>
            </tr>
            <tr>
              <th>Age:</th>
              <td colSpan="3">{age}</td>
            </tr>
            <tr>
              <th>Gender:</th>
              <td colSpan="3">{student.gender}</td>
            </tr>
            <tr>
              <th>Membership Status</th>
              <td colSpan="3">{membershipStatus}</td>
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
             <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;
                <Button bsSize="large" bsStyle='warning' onClick={this.onDeleteStudent}>Delete</Button></Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}><span className="pull-right"><Link to="students">
                  <Button bsSize="large">Back</Button></Link></span></Col>
            </Row>
          </Grid>

        </div>
      );
    }
    return (
      <div className="studentView container">
        <form>
          <h2>Update Student Information:</h2>
          <FirstName label="First Name" ref="firstName" name="firstName" defaultValue={student.firstName} />
          <LastName label="Last Name" ref="lastName" name="lastName" defaultValue={student.lastName} />
          <RankInput label="Rank" ref="rank" name="rank" ranks={this.state.ranks}  defaultValue={student.rank} />
          <GenderInput label="Gender" ref="gender" name="gender" defaultValue={student.gender} />
          <DateInput label="Birth Date" ref="bday" name="bday" defaultValue={editBdate} />
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
});