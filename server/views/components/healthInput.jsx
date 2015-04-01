var React = require('react');
var $ = require('jquery');
var {
  isAlpha,
  isLength,
  blacklist
} = require('validator');

var {
  Input
} = require('react-bootstrap');

var HealthInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true,
      value: this.props.defaultValue
    };
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  render: function() {
    var props = {
      label: this.props.label,
      type: "text",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value
    };

    var feedback;

    return (
      <div>
        <Input {...props} />
        {feedback}
      </div>
    );
  }
});