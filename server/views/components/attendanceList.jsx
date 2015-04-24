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
      sortdate: false,
      sortName: false
    };
  },
  componentWillMount: function() {debugger;
    var that = this;

    
    this.listenTo(studentStore, this.updateStudents, function(students) {
      that.updateStudents(students);
    });

    this.listenTo(classStore, this.updateClasses, function(classes) {
      that.updateClasses(classes);
    }); 
    // Listing to the attendance store for latest changes
    this.listenTo(attendanceStore, this.attendanceUpdate, function(initiaAttendances) {
      that.attendanceUpdate(initiaAttendances);
    });
     
     // For deletion succes vs failure
    this.listenTo(attendanceActions.deleteAttendance.completed, this.deleteAttendanceComplete);
    this.listenTo(attendanceActions.deleteAttendance.failed, this.deleteAttendanceFailed);
  },

  componentWillReceiveProps: function(newProps){
    this.doSearch(newProps.query);
  },

  attendanceUpdate: function(latestAttendance) {debugger;
    this.setState({
      attendances: latestAttendance,
      filtered: latestAttendance
    });
  },

  updateStudents: function(students) {debugger;
    var processedStudents = {};

    students.map(function(student){
      processedStudents[student._id] = student;
    });

    this.setState({
      students: processedStudents
    });
  },

  updateClasses: function(classes) {debugger;
    var processedClasses = {};

    classes.map(function(course){
      processedClasses[course._id] = course;
    });

    this.setState({
      classes: processedClasses
    });
  },
  hydrateAttendance: function(){
    var latestAttendance = this.state.attendances;
    var that = this;
    if (this.state.students && this.state.classes && this.state.filtered) {  
        var filteredAttendance = latestAttendance.map ( function (record) {
          var student = that.state.students[record.studentID];
          var course = that.state.classes[record.classID];
          return {
            "studentID":record.studentID,
            "lastName": student.lastName,
            "firstName": student.firstName,
            "classTime": record.classTime,
            "classDate": record.classDate,
            "classTitle":course.classTitle,
            "classID": record.classID
          }
        });
      return filteredAttendance;
    }
  },
  doSearch:function(queryText){debugger;
    var queryResult=[];
    var students = this.state.students;
    var classes = this.state.classes;
    var hydratedAttendance = this.hydrateAttendance();

    hydratedAttendance.forEach(function(record){
      var studentName = record.firstName+' '+record.lastName;
      if(studentName.toLowerCase().indexOf(queryText.toLowerCase())!= -1 || record.classTitle.toLowerCase().indexOf(queryText.toLowerCase())!= -1)
        queryResult.push(record);
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
  studentSort: function() {
    var sortedArray;
    var filteredAttendance=this.hydrateAttendance();

    if(this.state.sortName){
      sortedArray = filteredAttendance.sort(sortByKey("lastName",1));
    }else{
      sortedArray = filteredAttendance.sort(sortByKey("lastName",0));
    }
    this.setState({
      filtered: sortedArray,
      sortName: !this.state.sortName
    });
  },
  classSort: function() {
    var sortedArray;
    var filteredAttendance=this.hydrateAttendance();
    
    if(this.state.sortClass){
      sortedArray = filteredAttendance.sort(sortByKey("classTitle",1));
    }else{
      sortedArray = filteredAttendance.sort(sortByKey("classTitle",0));
    }
    this.setState({
      filtered: sortedArray,
      sortClass: !this.state.sortClass
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
  render: function() {debugger;
    var that = this;
    var content;
    var attendances = this.state.filtered;
    var dateOrder;
    var nameOrder;
    var classOrder;
    var view;

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

    if (this.state.sortName) {
      nameOrder = 
      <th>Student Name&nbsp; 
        <OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by Last name</strong></Tooltip>}>
        <Button bsSize="xsmall" onClick={this.studentSort}>&#9660;</Button>
        </OverlayTrigger>
      </th>
    }else{
      nameOrder = 
      <th>Student Name&nbsp; 
        <Button bsSize="xsmall" onClick={this.studentSort}>&#9650;</Button>
      </th>
    }

    if (this.state.sortClass) {
      classOrder = 
      <th>Class Title&nbsp; 
        <OverlayTrigger placement='top' overlay={<Tooltip><strong>Sort by class title</strong></Tooltip>}>
        <Button bsSize="xsmall" onClick={this.classSort}>&#9660;</Button>
        </OverlayTrigger>
      </th>
    }else{
      classOrder = 
      <th>Class Title&nbsp; 
        <Button bsSize="xsmall" onClick={this.classSort}>&#9650;</Button>
      </th>
    }

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
            {nameOrder}
            {classOrder}
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
