var React = require('react');
var Promise = require('bluebird');
var { ListenerMixin } = require('reflux');
var {
	Navigation,
	RouteHandler,
  Link
} = require('react-router');
var classActions = require('../actions/classActions.jsx');
var classStore = require('../stores/classStore.jsx');
var rankStore = require('../stores/rankStore.jsx');
var AlertDismissable = require('./alertDismissable.jsx');
var ClassTitle = require('./classTitle.jsx');
var RankInput = require('./rankInputforClass.jsx');
var {
  timeFormatting
} = require('../bin/utils.jsx')
var {
  Alert,
  Button,
  Input,
  Row,
  Col,
  Grid
} = require('react-bootstrap');

var EditClass = module.exports = React.createClass({
	mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      valid: true,
      emptyvalid: true
    };
  },

  componentWillMount: function() {
    var that = this;

    // Listen for changes to student model state, immediately showing the latest students
    // through the callback
    this.listenTo(classStore, this.showClass, function(classes) {
      that.showClass(classes);
    });

    // Listen for changes to student model state, immediately grabbing the most recent ranks
    // through the callback
    this.listenTo(rankStore, this.updateRanks, function(ranks) {
      that.updateRanks(ranks);
    });

    // Reflux can probably do this for us automatically, especially if we
    // use promise objects
    this.listenTo(classActions.editClass.completed, this.editClassComplete);
    this.listenTo(classActions.editClass.failed, this.editClassFailed);
  },
	showClass: function(classes) {
    var that = this;
    var id = that.props.routerParams.id;
    if(!classes){
    	that.setState({
    		course: null
    	});
    }
    classes.forEach(function(course) {
      if (id == course._id) {
        that.setState({
          course: course
        });
      }
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

  onEditClass: function(e){
    if (e) { e.preventDefault(); }

    var that = this;
    var valid = true;

    // For now, input only accepts one email so we
    // stuff it into an array
    if(!this.refs.classTitle.getValue() ||
      !this.refs.day.getValue()||
      !this.refs.startTime.getValue()||
      !this.refs.endTime.getValue()||
      !this.refs.classtype.getValue()
    ){
      this.setState({
        emptyvalid: false
      });
    }else{
      var newClass = {
        _id: this.props.routerParams.id,
        classTitle:this.refs.classTitle.getValue().trim(),
        dayOfWeek:Number(this.refs.day.getValue()),
        startTime:this.refs.startTime.getValue().trim(),
        endTime:this.refs.endTime.getValue().trim(),
        classType:this.refs.classtype.getValue().toString()
      };
      classActions.editClass(newClass);
    }
  },
  editClassFailed:function(err) {
    console.error("Editing a student failed: ", err);
    this.transitionTo('/classes');
  },
  editClassComplete: function() {
    this.transitionTo('/classes');
  },

  render: function() {
    var emptyWarn;
    var submitButton;
    var course = this.state.course;
    var classType = [];
    var startTime;
    var endTime;

    if (!this.state.emptyvalid){
      emptyWarn = (
        <Alert bsStyle="danger" id="alert">
          <p><strong>Please fill all text box</strong></p>
        </Alert>
      )
    }if(this.state.course){
    	classType=course.classType.split(',');
      startTime = timeFormatting(course.startTime);
      endTime = timeFormatting(course.endTime);
    }else{
    	return(
    		<div/>
    	);
    }
    return (
      <div className="addClass container">
        <form>
          <h2> Update Class Information:</h2>
          <ClassTitle label="Class Title" ref="classTitle" name="classTitle" defaultValue={course.classTitle} />
          <Input type="select" label="Day of Week" ref="day" name="day" defaultValue={course.dayOfWeek}>
            <option value="" disabled className="notDisplay">Select Day of Week</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </Input>
          <Input label="Class Time" wrapperClassName='wrapper'>
            <Row>
              <Col xs={6}>
                <Input type='time' ref="startTime" name="startTime" defaultValue={startTime}/>
              </Col>
              <Col xs={6}>
                <Input type='time' ref="endTime" name="endTime" defaultValue={endTime} />
              </Col>
            </Row>
          </Input>
          <RankInput label="Class Type" ref="classtype" name="classtype" ranks={this.state.ranks} defaultValue ={classType} />

          <AlertDismissable visable={!this.state.valid} />
          {emptyWarn}
          <Grid>
            <Row className="show-grid">
             <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditClass}>Save</Button></Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}><span className="pull-right"><Link to="classes"><Button bsSize="large">Cancel</Button></Link></span></Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
});
