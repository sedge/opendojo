var React = require('react');
var { ListenerMixin } = require('reflux');

var studentActions = require('../actions/studentActions.jsx');
var studentStore = require('../stores/studentStore.jsx');

var rankStore = require('../stores/rankStore.jsx');

var {
	ageCalculator,
	sortByKey
} = require('../bin/utils.jsx');

var {
 Link,
 Navigation
} = require('react-router');

var {
	Alert,
	Table,
	Button,
	Glyphicon,
	ButtonToolbar,
	OverlayTrigger,
	Tooltip
} = require('react-bootstrap');

var StudentList = module.exports = React.createClass({
  // Provides access to the router context object,
  // containing route-aware state (URL info etc.)
  contextTypes: {
    router: React.PropTypes.func
  },

	mixins: [ListenerMixin, Navigation],
	getInitialState: function(){
		return {
			students: null,
			filtered: null,
			sortname: true,
			sortage: true,
			sortrank: true
		};
	},
	doSearch:function(queryText){
		var queryResult=[];
		var hydratedStudent = this.hydrateStudent();

		hydratedStudent.forEach(function(person){
			var studentName = person.firstName+' '+person.lastName;
      if((studentName.toLowerCase().indexOf(queryText)!=-1) || (person.rankTitle.toLowerCase().indexOf(queryText.toLowerCase())!= -1)) {
       	queryResult.push(person);
      }
		});
    this.setState({
    	filtered:queryResult
    });
  },
	componentWillMount: function() {
		var that = this;

		this.listenTo(studentStore, this.studentsUpdate, function(initialStudents) {
			that.setState({
				students: initialStudents,
				filtered: initialStudents
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
			students: latestStudents,
			filtered: latestStudents
		});
	},
	 hydrateStudent: function(){
    var latestStudents = this.state.students;
    var that = this;
    if (this.state.ranks && this.state.students) {
        var filteredStudents = latestStudents.map ( function (student) {
          var rank = that.state.ranks[student.rankId];
          return {
          	"_id":student._id,
            "firstName":student.firstName,
            "lastName": student.lastName,
            "gender": student.gender,
            "rankId": student.rankId,
            "rankTitle": rank,
            "healthInformation":student.healthInformation,
            "emergencyphone": student.emergencyphone,
            "guardianInformation":student.guardianInformation,
            "email":student.email,
            "membershipStatus":student.membershipStatus,
            "membershipExpiry":student.membershipExpiry,
            "phone":student.phone,
            "birthDate":student.birthDate
          }
        });
      return filteredStudents;
    }
  },
	nameSort:function(){
		var sortedArray;
		if(this.state.sortname){
			sortedArray = this.state.filtered.sort(sortByKey("lastName",1));
		}else{
			sortedArray = this.state.filtered.sort(sortByKey("lastName",0));
		}
		this.setState({
			sortname: !this.state.sortname
		});
	},

	ageSort:function(){
		var sortedArray;
		if(this.state.sortage){
			sortedArray = this.state.filtered.sort(sortByKey("birthDate",0));
		}else{
			sortedArray = this.state.filtered.sort(sortByKey("birthDate",1));
		}
		this.setState({
			sortage: !this.state.sortage
		});
	},

	rankSort:function(){
		var sortedArray;
		var filteredStudent = this.hydrateStudent();
		if(this.state.sortrank){
			sortedArray = filteredStudent.sort(sortByKey("rankTitle",1));
		}else{
			sortedArray = filteredStudent.sort(sortByKey("rankTitle",0));
		}
		this.setState({
			filtered: sortedArray,
			sortrank: !this.state.sortrank
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
		var nameOrder;
		var rankOrder;
		var ageOrder;

		if (this.state.sortname){
			nameOrder = (
				<th>Student Name&nbsp;
					<OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Last Name</strong></Tooltip>}>
						<Button bsSize="xsmall" onClick={this.nameSort}>&#9660;</Button>
					</OverlayTrigger>
				</th>
			);
		}
		else{
			nameOrder = (
				<th>Student Name&nbsp;
					<OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Last Name</strong></Tooltip>}>
						<Button bsSize="xsmall" onClick={this.nameSort}>&#9650;</Button>
					</OverlayTrigger>
				</th>
			);
		}

		if (this.state.sortage){
			ageOrder = (
				<th>Age&nbsp;
					<OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Age</strong></Tooltip>}>
						<Button bsSize="xsmall" onClick={this.ageSort}>&#9660;</Button>
					</OverlayTrigger>
				</th>
			);
		}
		else{
			ageOrder = (
				<th>Age&nbsp;
					<OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Age</strong></Tooltip>}>
						<Button bsSize="xsmall" onClick={this.ageSort}>&#9650;</Button>
					</OverlayTrigger>
				</th>
			);
		}

		if (this.state.sortrank){
			rankOrder = (
				<th>Student Rank&nbsp;
					<OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Rank</strong></Tooltip>}>
						<Button bsSize="xsmall" onClick={this.rankSort}>&#9660;</Button>
					</OverlayTrigger>
				</th>
			);
		}
		else{
			rankOrder = (
				<th>Student Rank&nbsp;
					<OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Rank</strong></Tooltip>}>
						<Button bsSize="xsmall" onClick={this.rankSort}>&#9650;</Button>
					</OverlayTrigger>
				</th>
			);
		}

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
						<td>{student.firstName + " " + student.lastName}</td>
						<td>{student.phone}</td>
						<td>{rankName}</td>
						<td>{age}</td>
						<td>
							<ButtonToolbar>
       					<Link to="singleStudent" params={{id: student._id}}>
       						<Button bsSize="small">View</Button></Link>
      				</ButtonToolbar>
      			</td>
					</tr>
				);
			});


			view = (
				<Table>
					<thead>
						{nameOrder}
						<th>Phone #</th>
						{rankOrder}
						{ageOrder}
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

