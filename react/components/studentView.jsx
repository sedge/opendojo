var React = require('react');
var action = require('../actions/studentActions.jsx');
var Input = require('./input.jsx');

var {
	Alert,
	Table
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
		var emails = this.refs.emails.getValue().trim().split(',').map(function(email){
			return email.trim();
		});

		action.editStudent({
			firstName: this.refs.firstName.getValue().trim(),
			lastName: this.refs.lastName.getValue().trim(),
			rank: this.refs.rank.getValue().trim(),
			emails: emails
		});

		this.transitionTo('/students/all');
	},
	editToggle: function(e){
		this.setState({
			editable : !this.state.editable
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
					<div className="form-group">
						<form>
							<h2> Update student information:</h2>
							<input type="text" name="firstName" value={student.firstName}/>
							<button onClick={this.editStudent}>Save</button>
							<button onClick={this.editToggle}>Cancel</button>
						</form>
					</div>
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
