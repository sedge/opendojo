var React = require('react');
var { ListenerMixin } = require('reflux');
var { Navigation } = require('react-router');

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
	Alert
} = require('react-bootstrap');

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
				console.log("empty");
			this.setState({
				emptyvalid: false
			})
		}else{
			addStudent({
				firstName: this.refs.firstName.getValue().trim(),
				lastName: this.refs.lastName.getValue().trim(),
				phone: this.refs.phone.getValue().trim(),
				rankId: this.refs.rank.getValue().trim(),
				gender: this.refs.gender.getValue().trim(),
				birthDate: this.refs.bday.getValue().trim(),
				guardianInformation: this.refs.guardian.getValue().trim(),
				healthInformation: this.refs.health.getValue().trim(),
				email: emails
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
					<p><strong>Please fill all text box</strong></p>
				</Alert>
			)
		}
		return (
			<div className="addStudent container">
				<form>
					<h2> Enter new student information:</h2>
					{emptyWarn}
					<FirstName label="First Name" ref="firstName" name="firstName" placeholder="e.g. Bob" />
					<LastName label="Last Name" ref="lastName" name="lastName" placeholder="e.g. Smith" />
					<RankInput label="Rank" ref="rank" name="rank" placeholder="(colour)" ranks={this.state.ranks} />
					<PhoneInput label="Phone" ref="phone" name="phone" placeholder="XXX-XXX-XXXX" />
					<DateInput label="Birth Date" ref="bday" name="bday" placeholder="Age" />
					<GenderInput label="Gender" ref="gender" name="gender" placeholder="Gender" />
					<EmailInput label="Email" ref="emails" name="emails" placeholder="(comma delimited)" />
					<GuardianInput label="Guardian Information" ref="guardian" name="guardian" placeholder="(Name of guardian)" />
					<HealthInput label="Health Informaion" ref="health" name="health" placeholder="(Health Information)"/>

          <AlertDismissable visable={!this.state.valid} />

					<button onClick={this.handleSubmit}>Save</button>
				</form>
			</div>
		);
	}
});
