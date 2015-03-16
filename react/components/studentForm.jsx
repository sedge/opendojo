var React = require('react');
var Reflux = require('reflux');
var { Navigation } = require('react-router');

var action = require('../actions/studentActions.jsx');
var store = require('../stores/studentStore.jsx');

var { Input } = require('react-bootstrap');
var StudentForm = module.exports = React.createClass({
	mixins: [Navigation,Reflux.ListenerMixin],

	handleSubmit: function(e) {
		e.preventDefault();

		var emails = this.refs.emails.getValue().trim().split(',').map(function(email){
			return email.trim();
		});
		action.addStudent({
			firstName: this.refs.firstName.getValue().trim(),
			lastName: this.refs.lastName.getValue().trim(),
			phone: this.refs.phone.getValue().trim(),
			rank: this.refs.rank.getValue().trim(),
			bday: this.refs.bday.getValue().trim(),
			guardianinformation: this.refs.guardian.getValue().trim(),
			healthinfomation: this.refs.healthinfo.getValue().trim(),
			emails: emails
		});

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
					<Input label="Emails" type="text" ref="emails" name="emails" placeholder="(comma delimited)" />
					<Input label="Guardian Information" type="text" ref="guardian" name="guardian" placeholder="(Name of guardian)" />
					<Input label="Health Informaion" type="text" ref="healthinfo" name="healthinfo" placeholder="(Health Information)"/>
					<button onClick={this.handleSubmit}>Save</button>
				</form>
			</div>
		);
	}
});
