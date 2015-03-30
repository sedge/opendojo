var React = require('react');
var { ListenerMixin } = require('reflux');
var { Navigation } = require('react-router');

var { addStudent } = require('../actions/studentActions.jsx');
var store = require('../stores/studentStore.jsx');

var { Input } = require('react-bootstrap');
var StudentForm = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],

	componentWillMount: function() {
	  this.listenTo(studentActions.addStudent.completed, this.addStudentComplete);
	  this.listenTo(studentActions.addStudent.failed, this.addStudentFailed);
	},

	handleSubmit: function(e) {
		e.preventDefault();

		var emails = this.refs.emails.getValue().trim().split(',').map(function(email){
			return email.trim();
		});

		action.addStudent({
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
	},

	addStudentComplete: function() {
		this.transitionTo('/students');
	},
	addStudentFailed: function(err) {
		console.error('Adding a student failed: ', err);
		this.transitionTo('/students');
	},

	render: function() {
		return (
			<div className="addStudent container">
				<form>
					<h2> Enter new student information:</h2>
					<Input label="First Name" type="text" ref="firstName" name="firstName" placeholder="e.g. Bob" />
					<Input label="Last Name" type="text" ref="lastName" name="lastName" placeholder="e.g. Smith" />
					<Input label="Rank" type="text" ref="rank" name="rank" placeholder="(colour)" />
					<Input label="Phone" type="text" ref="phone" name="phone" placeholder="XXX-XXX-XXXX" />
					<Input label="Birth Date" type="date" ref="bday" name="bday" placeholder="Age" />
					<Input label="Gender" type="select" ref="gender" name="gender" placeholder="Gender">
						<option value='Male'>Male</option>
						<option value='Female'>Female</option>
					</Input>
					<Input label="Emails" type="text" ref="emails" name="emails" placeholder="(comma delimited)" />
					<Input label="Guardian Information" type="text" ref="guardian" name="guardian" placeholder="(Name of guardian)" />
					<Input label="Health Informaion" type="text" ref="health" name="health" placeholder="(Health Information)"/>
					<Input label="Health Informaion" type="text" ref="healthinfo" name="healthinfo" placeholder="(Health Information)"/>
					<button onClick={this.handleSubmit}>Save</button>
				</form>
			</div>
		);
	}
});
