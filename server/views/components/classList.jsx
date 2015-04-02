var React = require('react');
var { ListenerMixin } = require('reflux');

var classActions = require('../actions/classActions.jsx');
var classStore = require('../stores/classStore.jsx');

var rankStore = require('../stores/rankStore.jsx');

var {
 Link,
 Navigation
} = require('react-router');

var {
  sortByKey
} = require('../bin/utils.jsx');

var DeleteClassButton = require('./deleteClass.jsx');
var {
  Alert,
  Table,
  Button
} = require('react-bootstrap');

var ClassList = module.exports = React.createClass({
  mixins: [ListenerMixin, Navigation],
  getInitialState: function(){
    return {
      classes: null,
      filtered: null,
      sortday: true,
      editable: true
    };
  },
  doSearch:function(queryText){
    var queryResult=[];
    var day;
    this.state.classes.forEach(function(course){
      switch(course.dayOfWeek){
        case 1:
          day="Monday"
          break;
        case 2:
          day="Tuesday"
          break;
        case 3:
          day="Wednesday"
          break;
        case 4:
          day="Thursday"
          break;
        case 5:
          day="Friday"
          break;
        case 6:
          day="Saturday"
          break;
        case 7:
          day="Sunday"
          break;
        default:
          day=""
          break;
        }
      if(day.toLowerCase().indexOf(queryText)!=-1 || course.classTitle.toLowerCase().indexOf(queryText)!=-1)
        queryResult.push(course);
    });
    this.setState({
      filtered:queryResult
    });
  },

  componentWillMount: function() {
    var that = this;

    this.listenTo(classStore, this.classesUpdate, function(initialClasses) {
      that.setState({
        classes: initialClasses,
        filtered: initialClasses
      });
    });

    this.listenTo(rankStore, this.updateRanks, function(initialRanks) {
      that.updateRanks(initialRanks);
    });
  },
  componentWillReceiveProps: function(newProps){
    this.doSearch(newProps.query);
  },
  classesUpdate: function(latestClasses) {
    this.setState({
      classes: latestClasses
    });
    this.setState({
      filtered: this.state.classes
    });
  },

  daySort:function(){
    var sortedArray;
    if(this.state.sortday){
      sortedArray = this.state.filtered.sort(sortByKey("dayOfWeek",1));
    }else{
      sortedArray = this.state.filtered.sort(sortByKey("dayOfWeek",0));
    }
    this.setState({
      sortday: !this.state.sortday
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

  onDeleteClass: function(e,classId){
    var deleteClass = confirm("Do you want to delete the class?");
    if (deleteClass){
      classActions.deleteClass(classId);
    }
  },

  render: function() {
    var that = this;
    var day;
    var content;
    var classes = this.state.filtered;
    var dayOrder;
    var view;
    var startTime;
    var endTime;
    if (this.state.sortday){
      dayOrder = <th>Day <Button bsSize="xsmall" onClick={this.daySort}>&#9660;</Button></th>
    }else{
      dayOrder = <th>Day <Button bsSize="xsmall" onClick={this.daySort}>&#9650;</Button></th>
    }


    if (!classes) {
      view = (
        <Alert bsStyle="danger">
          There are no classes in the database!
        </Alert>
      );
    } else {
      var classRows;
      var key = 0;

      classRows = classes.map(function(course) {
        var ranks = that.state.ranks;
        var rankName;
        var rankFromDb;
        rankFromDb = course.classType.split(',');
        startTime = course.startTime.split(':')[0] +":" +course.startTime.split(':')[1];
        endTime = course.endTime.split(':')[0] +":" +course.endTime.split(':')[1];
        switch(course.dayOfWeek){
          case 1:
            day="Monday"
            break;
          case 2:
            day="Tuesday"
            break;
          case 3:
            day="Wednesday"
            break;
          case 4:
            day="Thursday"
            break;
          case 5:
            day="Friday"
            break;
          case 6:
            day="Saturday"
            break;
          case 7:
            day="Sunday"
            break;
          default:
            day=""
            break;
        }
        Object.keys(ranks).map(function(rankId) {
          if(rankFromDb.length == 1){
            if (rankId == rankFromDb[0]) {
              rankName = ranks[rankId];
            }
          }
          else{
            for(var i=0;i<rankFromDb.length;i++){
              if (rankId == rankFromDb[i]){
                if(!rankName){
                  rankName = ranks[rankId];
                }else{
                  rankName = rankName + ", " +ranks[rankId];
                }
              }
            }
          }
        });
        return (
          <tr key={key++}>
            <td>{course.classTitle}</td>
            <td>{day}</td>
            <td>{startTime} To {endTime} </td>
            <td className="rankName">{rankName}</td>
            <td><Link to="editClass" params={{id: course._id}}><Button bsSize="xsmall">Edit</Button></Link>&nbsp;&nbsp;
                <DeleteClassButton classId={course._id} onClick={that.onDeleteClass} bsSize="xsmall" />
            </td>
          </tr>
        );
      });

      view = (
        <Table>
          <thead>
            <th>Class Title</th>
            {dayOrder}
            <th>Time</th>
            <th>Class Type</th>
            <th></th>
          </thead>
          <tbody>
            {classRows}
          </tbody>
        </Table>
      );
    }
    return (
      <div className="classView container">
        {view}
      </div>
    );
  }
});

module.exports = ClassList;
