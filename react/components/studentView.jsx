var React = require('react');
var Reflux = require('reflux');
var action = require('../bin/studentActions');

var ReactBootstrap = require('react-bootstrap');
var Alert = ReactBootstrap.Alert;
var Table = ReactBootstrap.Table;

var StudentView = module.exports = React.createClass({
	mixins: [Reflux.ListenerMixin],
	deleteStudent: function(e){
		e.preventDefault();
		action.deleteStudent(this.props.routerParams.id);
		this.transitionTo('/students/all');
	},
	render: function() {
		var content;
		var studentId = this.props.routerParams.id;
		var student = action.getStudentById(studentId);

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
						<th>Emails:</th>
						<td colSpan="3">{emails}</td>
					</tr>
					<tr>
						<th></th>
						<td><button onClick={this.deleteStudent}>Delete</button></td>
					</tr>

				</Table>
			);
		}

		return (
			<div className="studentView container">
				{view}
			</div>
		);
	}
});
