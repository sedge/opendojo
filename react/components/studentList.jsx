var React = require('react');

var studentActions = require('../actions/studentActions.jsx');
var ReactBootstrap = require('react-bootstrap');

var { ListenerMixin } = require('reflux');
var {	store } = require('../stores/studentStore.jsx');
var { Link } = require('react-router');
var Route = require('react-router');
var {
	Alert,
	Table
} = ReactBootstrap;

var StudentList = module.exports = React.createClass({
	mixins: [ListenerMixin],
	getInitialState: function(){
		return {
			students: null
		};
	},
	componentDidMount: function() {
		this.listenTo(store, this.studentsUpdate, function(initialStudents) {
			this.setState({
				students: initialStudents
			});
		});
	},
	viewSingleStudent: function(id){
		Route.transitionTo("singleStudent", student.id);
	},
	studentsUpdate: function(students) {
		this.state.students = students;
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
				student.emails.forEach(function(email) {
					emails += email + " ";
				});
				return (
					<tr key={key++} onClick={StudentList.viewSingleStudent}> 
						<td>{student.id}</td>
						<td>{student.firstName + " " + student.lastName}</td>
						<td>Phone # goes here</td>
						<td>{emails}</td>
						<td>{student.rank}</td>
						<td>Age goes here</td>
						<td><Link to="singleStudent" params={{
							id: student.id
						}}>View</Link></td>
					</tr>
				);
			});

			view = (
				<Table id="studentListTable">
					<thead>
						<th>#</th>
						<th>Student Name</th>
						<th>Phone #</th>
						<th>Email</th>
						<th>Student Rank</th>
						<th>Age</th>
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
