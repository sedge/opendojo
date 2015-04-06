var React = require('react');
var { ListenerMixin } = require('reflux');

var attendanceStore = require('../stores/attendanceStore.jsx');
var attendanceActions = require('../actions/attendanceActions.jsx');
var studentStore = require('../stores/studentStore.jsx');
var classStore = require('../stores/classStore.jsx');
var DeleteAttendanceButton = require('./deleteAttendance.jsx');

var {
 Link,
 Navigation
} = require('react-router');

var {
  sortByKey,
  timeFormatting
} = require('../bin/utils.jsx');

var {
  Alert,
  Table,
  Button,
  ButtonToolbar,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');

var AttendanceList = module.exports = React.createClass({
  mixins: [ListenerMixin, Navigation],
  getInitialState: function(){
    return {
      attendances: null,
      filtered: null,
      students: null,
      classes: null,
      sortdate: null
    };
  },
  doSearch:function(queryText){
    var queryResult=[];
    var students = this.state.students;
    var classes = this.state.classes;

    this.state.attendances.forEach(function(attendance){
      var studentName;
      var className;

      if (students)
        {
          Object.keys(students).map(function(studentID){
            if (studentID == attendance.studentID) {
              studentName = students[studentID].firstName+' '+students[studentID].lastName;
            }
          });
        }
      if (classes)
        {
          Object.keys(classes).map(function(classID) {
           if (classID == attendance.classID) {
              className = classes[classID].classTitle;
            }
          });
        }

      if(studentName.toLowerCase().indexOf(queryText.toLowerCase())!= -1 || className.toLowerCase().indexOf(queryText.toLowerCase())!= -1)
        queryResult.push(attendance);
    });
    this.setState({
      filtered:queryResult
    });
  },
  dateSort:function(){
  var sortedArray;

    if(this.state.sortdate){
      sortedArray = this.state.filtered.sort(sortByKey("classDate",1));
    }else{
      sortedArray = this.state.filtered.sort(sortByKey("classDate",0));
    }
    this.setState({
      sortdate: !this.state.sortdate
    });
  },
  componentWillMount: function() {
    var that = this;

    // Listing to the attendance store for latest changes
    this.listenTo(attendanceStore, this.attendanceUpdate, function(initiaAttendances) {
      that.setState({
        attendances: initiaAttendances,
        filtered: initiaAttendances,
      });
    });

    //Getting the latest students to determine the student name from id
    this.listenTo(studentStore, this.updateStudents, function(students) {
      that.updateStudents(students);
    });

    //Getting the latest classes to get the class information by class Id
    this.listenTo(classStore, this.updateClasses, function(classes) {
      that.updateClasses(classes);
    });

     // For deletion succes vs failure
    this.listenTo(attendanceActions.deleteAttendance.completed, this.deleteAttendanceComplete);
    this.listenTo(attendanceActions.deleteAttendance.failed, this.deleteAttendanceFailed);
  },

  componentWillReceiveProps: function(newProps){
    this.doSearch(newProps.query);
  },

  attendanceUpdate: function(latestAttendance) {
    this.setState({
      attendances: latestAttendance,
      filtered: latestAttendance
    });
  },

  updateStudents: function(students) {
    var processedStudents = [];

    students.map(function(student){
      processedStudents[student._id] = student;
    });

    this.setState({
      students: processedStudents
    });
  },

  updateClasses: function(classes) {
    var processedClasses = [];

    classes.map(function(course){
      processedClasses[course._id] = course;
    });

    this.setState({
      classes: processedClasses
    });
  },
  //`Delete attendance` Action Handling
  handleDelete: function(e, attendanceId) {
    // Confirm delete
    var deleteAttendance = confirm("Do you want to delete the record?");
    if (deleteAttendance){
      // If they say yes, do:
      attendanceActions.deleteAttendance(attendanceId);
    }
  },
 
  onDeleteCompleted: function() {
    this.transitionTo("attendances");
  },

  deleteAttendanceComplete: function(attendances) {
    this.transitionTo("attendances");
  },
  deleteAttendanceFailed: function(attendances) {
    this.transitionTo("attendances");
  },
  getDay: function(day){
    var dayOfWeek;
    switch(day){
      case 1:
        dayOfWeek="Monday"
        break;
      case 2:
        dayOfWeek="Tuesday"
        break;
      case 3:
        dayOfWeek="Wednesday"
        break;
      case 4:
        dayOfWeek="Thursday"
        break;
      case 5:
        dayOfWeek="Friday"
        break;
      case 6:
        dayOfWeek="Saturday"
        break;
      case 7:
        dayOfWeek="Sunday"
        break;
      default:
        dayOfWeek=""
        break;
    }
    return dayOfWeek;
  },
  render: function() {
    var that = this;
    var content;
    var attendances = this.state.filtered;
    var dateOrder;

    if (this.state.sortdate){
      dateOrder = 
      <th>Class Date&nbsp; 
        <OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Class date</strong></Tooltip>}>
        <Button bsSize="xsmall" onClick={this.dateSort}>&#9660;</Button>
        </OverlayTrigger>
      </th>
    }else{
      dateOrder = 
      <th>Class Date&nbsp; 
        <Button bsSize="xsmall" onClick={this.dateSort}>&#9650;</Button>
      </th>
    }

    var view;
    if (!attendances) {
      view = (
        <Alert bsStyle="danger">
          There are no attendance records in the database!
        </Alert>
      );
    } else {
      var attendanceRows;
      var key = 0;

      attendanceRows = attendances.map(function(attendance) {
        var students = that.state.students;
        var classes = that.state.classes;
        var classDayOfWeek;
        var className; 
        var studentName;
        if (classes)
        {
          Object.keys(classes).map(function(classID) {
           if (classID == attendance.classID) {
              classDayOfWeek = that.getDay(classes[classID].dayOfWeek);
              className=classes[classID].classTitle;
            }
          });
        }

        if (students)
        {
          Object.keys(students).map(function(studentID){
            if (studentID == attendance.studentID) {
              studentName = students[studentID].firstName+' '+students[studentID].lastName;
            }
          });
        }

       var classDateUnmodified = attendance.classDate;
       classDateUnmodified = classDateUnmodified.split('T');
       var classDate = classDateUnmodified[0];
       var classTime = timeFormatting(attendance.classTime);

        return (
          <tr key={key++}>
            <td>{studentName}</td>
            <td>{className}</td>
            <td>{classDayOfWeek}, {classDate}</td>
            <td>{classTime}</td>
            <td><DeleteAttendanceButton attendanceId={attendance._id} onClick={that.handleDelete} bsSize="small" /></td>
          </tr>
        );
      });

      view = (
        <Table>
          <thead>
            <th>Student Name</th>
            <th>Class Title</th>
            {dateOrder}
            <th>Class time</th>
            <th></th>
          </thead>
          <tbody>
            {attendanceRows}
          </tbody>
        </Table>
      );
    }

    return (
      <div attendanceRows="attendanceView container">
        {view}
      </div>
    );
  }
});

module.exports = AttendanceList;
