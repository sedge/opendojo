var React = require('react');

var {
  Button
} = require('react-bootstrap');

var DeleteAttendanceButton = module.exports = React.createClass({

  onClick: function(e) {
    this.props.onClick(e, this.props.attendanceId);
  },

  render: function() {
    return (
        <Button bsSize={this.props.bsSize} bsStyle="warning" onClick={this.onClick} >Delete</Button>
    );
  }
});
