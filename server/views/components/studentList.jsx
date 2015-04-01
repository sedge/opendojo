var React = require('react');
var { ListenerMixin } = require('reflux');

var studentActions = require('../actions/studentActions.jsx');
var studentStore = require('../stores/studentStore.jsx');

var {
	ageCalculator
} = require('../bin/utils.jsx');

var {
 Link,
 Navigation
} = require('react-router');

var {
	Alert,
	Table
} = require('react-bootstrap');

var StudentList = module.exports = React.createClass({
	getInitialState: function(){
    return {
      filtered:null
    };
  },
  componentWillMount: function(){
  	this.setState({
  		filtered:this.props.students
  	});
  },
	componentWillReceiveProps: function(newProps){
		this.doSearch(newProps.query);
	},
	doSearch:function(queryText){
		var queryResult=[];

		this.props.students.forEach(function(person){
     	if((person.firstName.toLowerCase().indexOf(queryText)!=-1 )||(person.lastName.toLowerCase().indexOf(queryText)!=-1 ))
       	queryResult.push(person);
		});
    this.setState({
    	filtered:queryResult
    });
  },
 	render: function() {
		var students = this.state.filtered;
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
				var age = ageCalculator(student.birthDate);
				student.email.forEach(function(email) {
					emails += email + " ";
				});
				return (
					<tr key={key++}>
						<td>{student.firstName + " " + student.lastName}</td>
						<td>{student.phone}</td>
						<td>{emails}</td>
						<td>{student.rankId}</td>
						<td>{age}</td>
						<td>{student.guardianInformation}</td>
						<td><Link to="singleStudent" params={{
							id: student._id
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
