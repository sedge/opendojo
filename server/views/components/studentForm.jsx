var React = require('react');
var { ListenerMixin } = require('reflux');
var {
	Navigation,
	Link
} = require('react-router');

var { addStudent } = require('../actions/studentActions.jsx');

var rankStore = require('../stores/rankStore.jsx');

var FirstName = require('./firstName.jsx');
var LastName = require('./lastName.jsx');
var RankInput = require('./rankInput.jsx');
var GenderInput = require('./genderInput.jsx');
var DateInput = require('./dateInput.jsx');
var PhoneInput = require('./phoneInput.jsx');
var EmailInput = require('./emailInput.jsx');
var GuardianInput = require('./guardianInput.jsx');
var HealthInput = require('./healthInput.jsx');

var AlertDismissable = require('./alertDismissable.jsx');

var {
	Alert,
	Button,
	Row,
	Col,
	Grid
} = require('react-bootstrap');

var {
	capitalizeFirstLetter
} = require('../bin/utils.jsx');

var StudentForm = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],

	getInitialState: function() {
		return {
			valid: true,
			emptyvalid: true
		};
	},

	componentWillMount: function() {
		var that = this;

	  this.listenTo(addStudent.completed, this.addStudentComplete);
	  this.listenTo(addStudent.failed, this.addStudentFailed);

    // Listen for changes to student model state, immediately grabbing the most recent ranks
	  // through the callback
    this.listenTo(rankStore, this.updateRanks, function(ranks) {
      that.updateRanks(ranks);
    });
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

	handleSubmit: function(e) {
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

		if(!this.refs.firstName.getValue().trim() ||
				!this.refs.lastName.getValue().trim() ||
				!this.refs.phone.getValue().trim() ||
				!this.refs.rank.getValue().trim() ||
				!this.refs.gender.getValue().trim() ||
				!this.refs.bday.getValue().trim() ||
				!emails){
			this.setState({
				emptyvalid: false
			});
		}else{
			var fName = capitalizeFirstLetter(this.refs.firstName.getValue().trim());
			var lName = capitalizeFirstLetter(this.refs.lastName.getValue().trim());
			addStudent({
				firstName: fName,
				lastName: lName,
				phone: this.refs.phone.getValue().trim(),
				rankId: this.refs.rank.getValue().trim(),
				gender: this.refs.gender.getValue().trim(),
				birthDate: this.refs.bday.getValue().trim(),
				guardianInformation: this.refs.guardian.getValue().trim(),
				healthInformation: this.refs.health.getValue().trim(),
				email: emails,
				emergencyphone: this.refs.emergencyphone.getValue().trim()
			});
		}
	},

	addStudentComplete: function() {
		this.transitionTo('/students');
	},
	addStudentFailed: function(err) {
		console.error('Adding a student failed: ', err);
		this.transitionTo('/students');
	},

	render: function() {
		var emptyWarn;
		var submitButton;
		if (!this.state.emptyvalid){
			emptyWarn = (
				<Alert bsStyle="danger" id="alert">
					<p><strong>Please fill all information</strong></p>
				</Alert>
			)
		}
		return (
		  <div className="addStudent container">
            <form>
              <h2> Enter new student information:</h2>
              <Row>
                <Col xs={6} md={6}>
                  <FirstName label="First Name" ref="firstName" name="firstName" placeholder="e.g. Bob" />
                </Col>
                <Col xs={6} md={6}>
                  <LastName label="Last Name" ref="lastName" name="lastName" placeholder="e.g. Smith" />
                </Col>
              </Row>
              <Row>
                <Col xs={4} md={4}>
                  <RankInput label="Rank" ref="rank" name="rank" placeholder="(colour)" ranks={this.state.ranks} formType="student"/>
                </Col>
                <Col xs={4} md={4}>
                  <PhoneInput label="Phone" ref="phone" name="phone" placeholder="XXX-XXX-XXXX" />
                </Col>
                <Col xs={4} md={4}>
                  <DateInput label="Birth Date" ref="bday" name="bday" placeholder="Age" />
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={6}>
                  <GenderInput label="Gender" ref="gender" name="gender" placeholder="Gender" />
                </Col>
                <Col xs={6} md={6}>
                  <EmailInput label="Email" ref="emails" name="emails" placeholder="(comma delimited)" />
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={6}>
                  <GuardianInput label="Guardian Information" ref="guardian" name="guardian" placeholder="(Name of guardian)" />
                </Col>
                <Col xs={6} md={6}>
                  <PhoneInput label="Emergency Phone" ref="emergencyphone" name="emergencyphone" placeholder="XXX-XXX-XXXX" />
                </Col>
              </Row>
              <HealthInput label="Health Informaion" ref="health" name="health" placeholder="(Health Information)"/>
              <AlertDismissable visable={!this.state.valid} />
					{emptyWarn}
              <Grid>
                <Row className="show-grid">
                  <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.handleSubmit}>Save</Button></Col>
                  <Col xs={6} md={4}></Col>
                  <Col xs={6} md={4}><span className="pull-right"><Link to="students"><Button bsSize="large" >Cancel</Button></Link></span></Col>
                </Row>
              </Grid>
            </form>
		  </div>
		);
	}
});
