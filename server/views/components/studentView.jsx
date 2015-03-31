var React = require('react');
var Promise = require('bluebird');

var { ListenerMixin } = require('reflux');
var { Navigation } = require('react-router');

var studentStore = require('../stores/studentStore.jsx');
var studentActions = require('../actions/studentActions.jsx');

var {
  Alert,
  Table
} = require('react-bootstrap');

var {
  ageCalculator,
  membershipStatusCalculator
} = require('../bin/utils.jsx');

var FirstName = require('./FirstName.jsx');
var AlertDismissable = require('./AlertDismissable.jsx');

var StudentView = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      editable: false
    };
  },

  componentWillMount: function() {
    var that = this;

    // Listen for changes to model state, immediately showing the latest students
    // through the callback
    this.listenTo(studentStore, this.showStudent, function(students) {
      that.showStudent(students);
    });

    // Reflux can probably do this for us automatically, especially if we
    // use promise objects
    this.listenTo(studentActions.deleteStudent.completed, this.deleteStudentComplete);
    this.listenTo(studentActions.deleteStudent.failed, this.deleteStudentFailed);
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
  onEditStudent: function(e){debugger;
    if (e) { e.preventDefault(); }

    var valid = true;
    var that = this;

    var keys = Object.keys(this.refs);
    keys.forEach(function(ref) {
      var child = that.refs[ref];

      // Is it in a valid state?
      if (!child.state.valid) {
        valid = false;
      }
    });

    if (!valid) {
      console.log("Invalid!");
      return;
    }

    var emails = this.refs.emails.getValue().trim().split(',').map(function(email){
      return email.trim();
    });

    var newStudent = {
      _id: this.props.routerParams.id,
      firstName: this.refs.firstName.getValue().trim(),
      lastName: this.refs.lastName.getValue().trim(),
      phone: this.refs.phone.getValue().trim(),
      rankId: parseInt(this.refs.rank.getValue().trim(), 10),
      birthDate: this.refs.bday.getValue().trim(),
      gender: this.refs.gender.getValue().trim(),
      guardianInformation: this.refs.guardian.getValue().trim(),
      healthInformation: this.refs.healthinfo.getValue().trim(),
      email: emails
    };
    studentActions.editStudent(newStudent);
  },
  editStudentFailed:function(err) {
    console.error("Editing a student failed: ", err);
    this.transitionTo("singleStudent", { id: this.props.routerParams.id });
  },
  editStudentComplete: function() {
    this.transitionTo("singleStudent", { id: this.props.routerParams.id });
  },

  // `DeleteStudent` Action Handling
  onDeleteStudent: function(e){
    studentActions.deleteStudent(this.props.routerParams.id);
  },
  deleteStudentComplete: function(students) {
    this.transitionTo("students");
  },
  deleteStudentFailed: function(students) {
    console.error("Editing a student failed: ", err);
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
              <th>Id:</th>
              <td colSpan="3">{student._id}</td>
            </tr>
            <tr>
              <th>Rank:</th>
              <td colSpan="3">{student.rankId}</td>
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
              <td colSpan="3">{student.guardianInformation}</td>
            </tr>
            <tr>
              <th>Health Information</th>
              <td colSpan="3">{student.healthInformation}</td>
            </tr>
            <tr>
              <th></th>
              <td><button onClick={this.deleteStudent}>Delete</button>
                <button onClick={this.editToggle}>Edit</button>
              </td>
            </tr>
          </Table>
        </div>
      );
    }

    return (
      <div className="studentView container">
        <form>
          <h2>Update student information:</h2>

          <FirstName label="First Name" type="text" ref="firstName" name="firstName" defaultValue={student.firstName} />
{/*          <LastName label="Last Name" type="text" ref="lastName" name="lastName" defaultValue={student.lastName} />
          <Rank label="Rank" type="text" ref="rank" name="rank" defaultValue={student.rank} />
          <BirthDate label="Birth Date" type="date" ref="bday" name="bday" defaultValue={student.birthDate} />
          <Gender label="Gender" type="select" ref="gender" name="gender" defaultValue={student.gender} />
          <Phone label="Phone" type="text" ref="phone" name="phone" defaultValue={student.phone} />
          <Emails label="Emails" type="text" ref="emails" name="emails" defaultValue={emails} />
          <Guardian label="Guardian Information" type="text" ref="guardian" name="guardian" defaultValue={student.guardianInformation} />
          <Health label="Health Informaion" type="text" ref="healthinfo" name="healthinfo" defaultValue={student.healthInformation}/> */}

          <button onClick={this.onEditStudent}>Save</button>
          <button onClick={this.editToggle}>Cancel</button>

        </form>
      </div>
    );
  }
});