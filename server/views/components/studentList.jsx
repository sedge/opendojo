var React = require('react');
var { ListenerMixin } = require('reflux');

var studentActions = require('../actions/studentActions.jsx');
var studentStore = require('../stores/studentStore.jsx');

var rankStore = require('../stores/rankStore.jsx');

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
	mixins: [ListenerMixin, Navigation],
	getInitialState: function(){
		return {
			students: null,
			filtered: null
		};
	},
	doSearch:function(queryText){
		var queryResult=[];

		this.state.students.forEach(function(person){
     	if((person.firstName.toLowerCase().indexOf(queryText)!=-1 )||(person.lastName.toLowerCase().indexOf(queryText)!=-1 ))
       	queryResult.push(person);
		});
    this.setState({
    	filtered:queryResult
    });
  },
	componentWillMount: function() {
		var that = this;

		this.listenTo(studentStore, this.studentsUpdate, function(initialStudents) {
			that.setState({
				students: initialStudents
			});
		});

		this.listenTo(rankStore, this.updateRanks, function(initialRanks) {
			that.updateRanks(initialRanks);
		});
	},
	componentWillReceiveProps: function(newProps){
		this.doSearch(newProps.query);
	},
	studentsUpdate: function(latestStudents) {
		this.setState({
			students: latestStudents
		});
		this.setState({
			filtered: this.state.students
		});
	},

  updateRanks: function(ranks) {
    var processedRanks = {};

    ranks.map(function(rank){
      processedRanks[rank._id] = rank.name;
    });

    this.setState({
      ranks: processedRanks
    });
  },

	render: function() {
		var that = this;

		var content;
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

				var ranks = that.state.ranks;
				var rankName;

				Object.keys(ranks).map(function(rankId) {
				  if (rankId == student.rankId) {
				    rankName = ranks[rankId];
				  }
				});

				return (
					<tr key={key++}>
						<td onClick={StudentList.viewSingleStudent}>{student.firstName + " " + student.lastName}</td>
						<td>{student.phone}</td>
						<td>{emails}</td>
						<td>{rankName}</td>
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
