var React = require('react');
var Reflux = require('reflux');
var { Navigation } = require('react-router');

var action = require('../actions/studentActions.jsx');
var store = require('../stores/studentStore.jsx');
var newId = store.UUID();

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
			age: this.refs.age.getValue().trim(),
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
					<Input label="Age" type="text" ref="age" name="age" placeholder="Age" />
					<Input label="Emails" type="text" ref="emails" name="emails" placeholder="(comma delimited)" />
					<button onClick={this.handleSubmit}>Save</button>
				</form>
			</div>
		);
	}
});
