var React = require("react");
var Reflux = require("reflux");

var $ = require('zeptojs');
var moment = require('moment');

var Timestamp = module.exports = React.createClass({
  componentDidMount: function() {
    this.updateTimestamp();
    this.setState({
      timestampIntervalKey: setInterval(this.updateTimestamp, 1000)
    });
  },
  componentWillUnmount: function() {
    clearInterval(this.state.timestampIntervalKey);
  },
  componentWillRecieveProps: function(newProps) {

  },
  updateTimestamp: function() {
    var timeRightNow = moment().format("h:mm:ss a");
    var message;
    var currentCourseTitle = this.props.courseTitle;

    if (currentCourseTitle) {
      message = '<h2>Check-in for <strong>' + this.props.courseTitle + '</strong> (' + this.props.courseTime + ') | <strong>' +  timeRightNow + '</strong></h2>';
    } else {
      message = '<h2>The time is <strong>' +  timeRightNow + '</strong></h2>';
    }

    $("#timestamp")
      .empty()
      .append(message);
  },
  render: function() {
    return (
      <div id="timestamp" />
    );
  }
});
