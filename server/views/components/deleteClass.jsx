var React = require('react');
var $ = require('jquery');
var {
  isAlpha,
  isLength,
  blacklist
} = require('validator');

var {
  Button
} = require('react-bootstrap');

var DeleteClassButton = module.exports = React.createClass({

  onClick: function(e) {
    this.props.onClick(e, this.props.classId);
  },

  render: function() {
    return (
        <Button bsSize={this.props.bsSize} bsStyle='warning' onClick={this.onClick} >Delete</Button>
    );
  }
});
