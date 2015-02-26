var React = require('react');
var models = require('../bin/model');

var ReactBootstrap = require('react-bootstrap');
var Alert = ReactBootstrap.Alert;
var Table = ReactBootstrap.Table;

var StudentView = module.exports = React.createClass({
	render: function() {
		var content;
		var studentId = this.props.routerParams.id;
		var student = models.getStudentById(studentId);

		var view;

		if (!student) {
			view = (
				<Alert bsStyle="danger">
					The student associated with <strong>ID {this.props.id}</strong> does not exist.
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
