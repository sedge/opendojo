var React = require('react');

var studentActions = require('../actions/studentActions.jsx');
var ReactBootstrap = require('react-bootstrap');

var { ListenerMixin } = require('reflux');
var {	store,
			agecal } = require('../stores/studentStore.jsx');
var { Link, Navigation } = require('react-router');
var {
	Alert,
	Table
} = ReactBootstrap;



var StudentList = module.exports = React.createClass({
	mixins: [ListenerMixin,Navigation],
	getInitialState: function(){
		return {
		};
	},
	componentWillMount: function() {
		this.listenTo(store, this.studentsUpdate, function(initialStudents) {
			this.setState({
				students: initialStudents
			});
		});
	},
	studentsUpdate: function(newstudents) {
		this.setState({
			students: newstudents
		});
	},

	render: function() {
		var content;
		var students = this.state.students;
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
				var age = agecal(student.birthDate);
				student.email.forEach(function(email) {
					emails += email + " ";
				});
				return (
					<tr key={key++}> 
						<td onClick={StudentList.viewSingleStudent}>{student.firstName + " " + student.lastName}</td>
						<td>{student.phone}</td>
						<td>{emails}</td>
						<td>{student.rankId}</td>
						<td>{age}</td>
						<td>{student.guardianInformation}</td>
						<td><Link to="singleStudent" params={{
							_id: student._id
						}}>View</Link></td>
					</tr>
				);
			});

			view = (
				<Table>
					<thead>
						<th>Student Name</th>
						<th>Phone #</th>
						<th>Email</th>
						<th>Student Rank</th>
						<th>Age</th>
						<th>Guardian</th>
						<th></th>
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