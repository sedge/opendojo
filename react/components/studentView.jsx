var React = require('react');
var action = require('../actions/studentActions.jsx');
var {
	Alert,
	Table,
	Input
} = require('react-bootstrap');
var { ListenerMixin } = require('reflux');
var {	store } = require('../stores/studentStore.jsx');
var { Navigation } = require('react-router');

var StudentView = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],
	getInitialState: function() {
		return {
			student: null,
			editable : false
		};
	},
	componentWillMount: function() {
		var that = this;

		this.listenTo(store, this.updateStudent, function(students) {
			var id = that.props.routerParams.id;

			students.forEach(function(student) {
				if (id == student.id) {
					that.setState({
						student: student
					});
				}
			});
		});
	},
	editStudent: function(e){
		e.preventDefault();
		var emails = this.refs.emails.getValue().trim().split(',').map(function(email){
			return email.trim();
		});

		var newstu = {
			id: this.props.routerParams.id,
			firstName: this.refs.firstName.getValue().trim(),
			lastName: this.refs.lastName.getValue().trim(),
			phone: this.refs.phone.getValue().trim(),
			rank: this.refs.rank.getValue().trim(),
			age: this.refs.age.getValue().trim(),
			emails: emails
		};
		action.editStudent(newstu);
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
		action.deleteStudent(this.props.routerParams.id);

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
					The student associated with <strong>ID {this.props.routerParams.id}</strong> does not exist.
				</Alert>
			);
		} else {
			var emails = "";
					student.emails.forEach(function(email) {
				emails += email + " ";
			});
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
							<td colSpan="3">{student.id}</td>
						</tr>
						<tr>
							<th>Rank:</th>
							<td colSpan="3">{student.rank}</td>
						</tr>
						<tr>
							<th>Age:</th>
							<td colSpan="3">{student.age}</td>
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
