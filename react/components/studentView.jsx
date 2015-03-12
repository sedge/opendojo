var React = require('react');
var action = require('../bin/studentActions');

var {
	Alert,
	Table
} = require('react-bootstrap');
var { ListenerMixin } = require('reflux');
var {	store } = require('../bin/studentStore.js');
var { Navigation } = require('react-router');

var StudentView = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],
	getInitialState: function() {
		return {
			student: null
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

	deleteStudent: function(e){
		e.preventDefault();
		action.deleteStudent(this.props.routerParams.id);

		this.transitionTo('/students/all');
	},
	render: function() {
		var content;
		var student = this.state.student;

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
