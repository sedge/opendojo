var React = require('react');
var action = require('../actions/studentActions.jsx');
var {
	Alert,
	Table,
	Input
} = require('react-bootstrap');
var { ListenerMixin } = require('reflux');
var {	store,
			agecal,
			membershipStatusCalculator } = require('../stores/studentStore.jsx');
var { Navigation } = require('react-router');

var StudentView = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],
	getInitialState: function() {
		return {
			editable : false
		};
	},
	componentWillMount: function() {
		var that = this;

		this.listenTo(store, this.updateStudent, function(students) {
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
		var emails = this.refs.email.getValue().trim().split(',').map(function(email){
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
		action.editStudent(newStudent);
		this.transitionTo('/students');
	},
	editToggle: function(e){
		e.preventDefault();
		this.setState({
			editable : !this.state.editable
		});
	},
	deleteStudent: function(e){
		e.preventDefault();
		action.deleteStudent(this.props.routerParams._id);

		this.transitionTo('/students');
	},
	render: function() {
		var content;
		var student = this.state.student;
		var editable = this.state.editable;
		var view;
		if (!student) {
			view = (
				<Alert bsStyle="danger">
					The student associated with <strong>ID {this.props.routerParams._id}</strong> does not exist.
				</Alert>
			);
		} else {
			var emails = "";
					student.email.forEach(function(email) {
				emails += email + " ";
			});
			var age = agecal(student.birthDate);
			var membershipStatus = membershipStatusCalculator(student.membershipExpiry);

			if(!editable){
				view = (
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
				);
			}else{
				view = (
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
				);
			}
		}
		

		return (
			<div className="studentView container">
				{view}
			</div>
		);
	}
});
