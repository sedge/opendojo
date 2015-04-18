var React = require('react');
var Promise = require('bluebird');

var { ListenerMixin } = require('reflux');
var {
  Navigation,
  Link
 } = require('react-router');

var studentStore = require('../stores/studentStore.jsx');
var studentActions = require('../actions/studentActions.jsx');

var { isNumeric } = require('validator');

var rankStore = require('../stores/rankStore.jsx');

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
      settingMembership: false,
      valid: true,
      selectPeriod: 0,
      periodAddButton: false,
      daysadded: 0
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

  settingMembershipToggle: function(e){
    e.preventDefault();
    this.setState({
      settingMembership: !this.state.settingMembership,
      selectPeriod: 0,
      periodAddButton: false,
      daysadded: 0
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

  onSettingMembership: function(e){
    if (e) { e.preventDefault(); }

    var expiryDate;

    if (this.refs.period.getValue() == 2){
      expiryDate = new Date(this.refs.expiryDate.getValue());
      expiryDate.setDate(expiryDate.getDate()+1);
    }
    else{
      expiryDate = new Date(this.state.student.membershipExpiry);
      expiryDate.setDate(expiryDate.getDate()+this.state.daysadded);
    }
    var newStudent = {
      _id: this.state.student._id,
      firstName: this.state.student.firstName,
      lastName: this.state.student.lastName,
      phone: this.state.student.phone,
      rankId: this.state.student.rankId,
      birthDate: this.state.student.birthDate,
      gender: this.state.student.gender,
      guardianInformation: this.state.student.guardianInformation,
      healthInformation: this.state.student.healthInformation,
      email: this.state.student.email,
      emergencyphone: this.refs.emergencyphone,
      membershipExpiry: expiryDate
    }
    this.setState({
      daysadded: 0,
      selectPeriod: 0
    });
    studentActions.editStudent(newStudent);
  },
  addDays: function(){
    if(this.refs.period.getValue() == 30){
      this.setState({
        daysadded: this.state.daysadded+30
      });
    }
    else if(this.refs.period.getValue() == 90){
      this.setState({
        daysadded: this.state.daysadded+90
      });
    }
    else if(this.refs.period.getValue() == 180){
      this.setState({
        daysadded: this.state.daysadded+180
      });
    }
    else{
      if(!isNumeric(Number(this.refs.manualPeriod.getValue()))){
        return;
      }
      else{
        this.setState({
          daysadded: this.state.daysadded+Number(this.refs.manualPeriod.getValue())
        });
      }
    }
  },
  editStudentFailed:function(err) {
    console.error("Editing a student failed: ", err);
    if(this.state.editable){
      this.setState({
        editable: false
      });
    }
    else{
      this.setState({
        settingMembership: false
      });
    }
  },
  editStudentComplete: function() {
    if(this.state.editable){
      this.setState({
        editable: false
      });
    }
    else{
      this.setState({
        settingMembership: false
      });
    }
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
  onChange: function(){
    if (this.refs.period.getValue() != 0 || this.refs.period.getValue() != 2){
      this.setState({
        periodAddButton: true
      });
    }
    else{
      this.setState({
        periodAddButton: false
      });
    }
    if (this.refs.period.getValue() == 1){
      this.setState({
        selectPeriod: 1
      });
    }
    else if(this.refs.period.getValue() == 2){
      this.setState({
        selectPeriod: 2,
        daysadded: 0
      });
    }
    else if(this.refs.period.getValue() != 0){
      this.setState({
        selectPeriod: 3
      });
    }
    else{
      this.setState({
        selectPeriod: 0
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
    var membershipExpiryDate = bdateForEdit(student.membershipExpiry);
    var age = ageCalculator(student.birthDate);
    var membershipStatus = membershipStatusCalculator(student.membershipExpiry);
    var editBdate = bdateForEdit(student.birthDate);
    var ranks = this.state.ranks;
    var rankName;
    var emergencyPhone = null;
    var periodAdd;
    var periodAddForManual;
    var daysDisplay = (
        <div>
          {this.state.daysadded} days will be added
        </div>
        );

    if (this.state.selectPeriod == 1){
      periodAdd = (
        <div>
          <FirstName label="Enter Days" ref="manualPeriod" name="manualPeriod" help="Enter number of days you want to add" />
        </div>
      );
      periodAddForManual = (
        <div>
          <br/><Button onClick={this.addDays}>+</Button>
        </div>
      );
    }
    else if (this.state.selectPeriod == 2){
      periodAdd = (
        <div>
          <DateInput label="Select Date" ref="expiryDate" name="expiryDate" defaultValue={membershipExpiryDate} />
        </div>
      );
      daysDisplay = (
        <div></div>
      );
    }
    else if (this.state.selectPeriod == 3){
      periodAdd = (
        <div>
          <br/><Button onClick={this.addDays}>+</Button>
        </div>
      );

    }
    else{
      periodAdd = (
        <div></div>
      );
      periodAddForManual = (
        <div></div>
      );
      daysDisplay = (
        <div></div>
      );
    }
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
    if(!editable && !settingMembership){
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
             <Col xs={12} md={8}><Button bsSize="large" bsStyle='primary' onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;
                <Button bsSize="large" bsStyle='primary' onClick={this.settingMembershipToggle}>Membership Status</Button>&nbsp;&nbsp;
                <Button bsSize="large" bsStyle='warning' onClick={this.onDeleteStudent}>Delete</Button></Col>
              <Col xs={6} md={4}><span className="pull-right"><Link to="students">
                  <Button bsSize="large">Back</Button></Link></span></Col>
            </Row>
          </Grid>
          <br />
        </div>
      );
    }
    if(editable && !settingMembership){
      return (
        <div className="studentView container">
          <form>
            <h2>Update Student Information:</h2>
            <Row>
              <Col md={6}>
                <FirstName label="First Name" ref="firstName" name="firstName" defaultValue={student.firstName} />
              </Col>
              <Col md={6}>
                <LastName label="Last Name" ref="lastName" name="lastName" defaultValue={student.lastName} />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <DateInput label="Birth Date" ref="bday" name="bday" defaultValue={editBdate} />
              </Col>
              <Col md={4}>
                <GenderInput label="Gender" ref="gender" name="gender" defaultValue={student.gender} />
              </Col>
              <Col md={4}>
                <GuardianInput label="Guardian Information" type="text" ref="guardian" name="guardian" defaultValue={student.guardianInformation} placeholder="(Optional)" />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <EmailInput label="Emails" type="text" ref="emails" name="emails" defaultValue={emails} />
              </Col>
              <Col md={6}>
                <PhoneInput label="Phone" ref="phone" name="phone" defaultValue={student.phone} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <HealthInput label="Health Information" type="text" ref="healthinfo" name="healthinfo" defaultValue={student.healthInformation} placeholder="(Optional)" />
              </Col>
              <Col md={6}>
                <PhoneInput label="Emergency Phone" ref="emergencyphone" name="emergencyphone" defaultValue={student.emergencyphone} />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <RankInput label="Rank" ref="rank" name="rank" ranks={this.state.ranks}  defaultValue={student.rankId} />
              </Col>
            </Row>
            <AlertDismissable visable={!this.state.valid} />
            <Grid>
              <Row className="show-grid">
               <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditStudent}>Save</Button></Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" onClick={this.editToggle}>Cancel</Button></span></Col>
              </Row>
            </Grid>
          </form>
          <br />
        </div>
      );
    }
    if(settingMembership && !editable){
      return (
        <div className="studentView container">
          <h2>Membership Setting</h2>
          <Table bordered={true} striped={true}>
            <tr>
              <th width="40%">Membership Expiry Date:</th>
              <td width="60%">{membershipExpiryDate}</td>
            </tr>
            <tr>
              <th>Membership Status:</th>
              <td>{membershipStatus}</td>
            </tr>
          </Table>
          <form>
            <Grid>
              <Row className="show-grid">
                <Col xs={6} md={4}>
                  <Input type='select' label="Add Period" ref="period" name="period" onChange={this.onChange}>
                    <option value="" disabled defaultValue className="notDisplay">Select Period</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="180">6 Months</option>
                    <option value="1">Input Period Manually</option>
                    <option value="2">Select Date from Calendar</option>
                  </Input>
                  {daysDisplay}
                </Col>
                <Col xs={6} md={4}>{periodAdd}</Col>
                <Col xs={6} md={4}>{periodAddForManual}</Col>
              </Row>
            </Grid>
            <AlertDismissable visable={!this.state.valid} />
            <br/>
            <Grid>
              <Row className="show-grid">
                <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onSettingMembership}>Save</Button></Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" onClick={this.settingMembershipToggle}>Cancel</Button></span></Col>
              </Row>
            </Grid>
          </form>
          <br />
        </div>
      );
    }
  }
});
