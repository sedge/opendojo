var React = require('react');
var models = require('../bin/model');

var Router = require('react-router');
var { Link } = Router;

var ReactBootstrap = require('react-bootstrap');
var {
	Alert,
	Table
} = ReactBootstrap;

var StudentList = React.createClass({
	render: function() {
		var content;
		var students = models.getAllStudents();

		var view;

		if (!students) {
			view = (
				<Alert bsStyle="danger">
					There are no students in the database!
				</Alert>
			);
		} else {
			var studentRows;
			var key = 0;

			studentRows = students.map(function(student) {
				var emails = "";
				student.emails.forEach(function(email) {
					emails += email + " ";
				});

				return (
					<tr key={key++}>
						<td>{student.id}</td>
						<td>{student.firstName + " " + student.lastName}</td>
						<td>{student.rank}</td>
						<td><Link to="singleStudent" params={{
							id: student.id
						}}>View</Link></td>
					</tr>
				);
			});

			view = (
				<Table bordered={true} striped={true}>
					<thead>
						<th>#</th>
						<th>Student Name</th>
						<th>Student Rank</th>
						<th><Link to="addStudent">Add new student</Link></th>
					</thead>
					<tbody>
						{studentRows}
					</tbody>
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

module.exports = StudentList;
