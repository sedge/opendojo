var React = require('react');
var Promise = require('bluebird');
var { ListenerMixin } = require('reflux');
var { Navigation } = require('react-router');

var {
	Alert,
	Table,
	Input
} = require('react-bootstrap');

var studentStore = require('../stores/studentStore.jsx');
var studentActions = require('../actions/studentActions.jsx');

var {
	ageCalculator,
	membershipStatusCalculator
} = require('../bin/utils.jsx');

var StudentView = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],
	getInitialState: function() {
		return {
			editable : false
		};
	},
	componentWillMount: function() {
		var that = this;

		this.listenTo(studentStore, this.updateStudent, function(students) {
			var id = that.props.routerParams._id;

			students.forEach(function(student) {
				if (id == student._id) {
					that.setState({
						student: student
					});
				}
			});
		});
	},
	editStudent: function(e){
		e.preventDefault();

		// Validation needs to go here
		var emails = this.refs.emails.getValue().trim().split(',').map(function(email){
			return email.trim();
		});

		var newStudent = {
			id: this.props.routerParams._id,
			firstName: this.refs.firstName.getValue().trim(),
			lastName: this.refs.lastName.getValue().trim(),
			phone: this.refs.phone.getValue().trim(),
			rank: this.refs.rank.getValue().trim(),
			age: this.refs.age.getValue().trim(),
			email: emails
		};
		studentActions.editStudent(newStudent);
	},
	editToggle: function(e){
		e.preventDefault();
		this.setState({
			editable : !this.state.editable
		});
	},
	deleteStudent: function(e){
		e.preventDefault();
		studentActions.deleteStudent(this.props.routerParams._id);

		this.transitionTo('/students');
	},
	render: function() {
		var content;
		var student = this.state.student;
		var editable = this.state.editable;

		if (!student) {
			return (
				<div className="studentView container">
					<Alert bsStyle="danger">
						The student associated with <strong>ID {this.props.routerParams._id}</strong> does not exist.
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
					<h2> Update student information:</h2>
					<Input label="First Name" type="text" ref="firstName" name="firstName" defaultValue={student.firstName} />
					<Input label="Last Name" type="text" ref="lastName" name="lastName" defaultValue={student.lastName} />
					<Input label="Rank" type="text" ref="rank" name="rank" defaultValue={student.rank} />
					<Input label="Age" type="text" ref="age" name="age" defaultValue={student.age} />
					<Input label="Phone" type="text" ref="phone" name="phone" defaultValue={student.phone} />
					<Input label="Emails" type="text" ref="emails" name="emails" defaultValue={student.emails} />
					<button onClick={this.editStudent}>Save</button>
					<button onClick={this.editToggle}>Cancel</button>
				</form>
			</div>
		);
	}
});
