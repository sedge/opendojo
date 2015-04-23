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
      readOnly: this.props.readOnly,
      defaultValue: this.state.value,
      placeholder: this.props.placeholder
    };

    var feedback;

    return (
      <div>
        <Input className="form-disabled" {...props} />
        {feedback}
      </div>
    );
  }
});