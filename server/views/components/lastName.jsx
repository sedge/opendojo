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

var LastName = module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true,
      value: this.props.defaultValue
    };
  },

  onChange: function(e) {
    var ref = this.refs[this.props.name];
    var value = ref.getValue().trim();

    // Allow whitespace
    var sanitized = blacklist(value, " \'-");

    if (!isLength(sanitized, 1, 30) || !isAlpha(sanitized)) {
      return this.setState({
        valid: false,
        value: value
      });
    }

    if (!this.state.valid) {
      this.setState({
        valid: true,
        value: value
      });
    }
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  validationState: function() {
    if (this.state.valid) {
      return;
    }
    return "error";
  },

  render: function() {
    var props = {
      label: this.props.label,
      type: "text",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value,
      placeholder: this.props.placeholder
    };
    if (this.validationState()) {
      props.bsStyle = this.validationState();
    }

    var feedback;
    if (!this.state.valid) {
      feedback = (
        <p><strong>A last name is required, must only be letters, apostrophes, and hyphens, and must not exceed 30 characters.</strong></p>
      );
    }

    return (
      <div>
        <Input {...props} onChange={this.onChange} />
        {feedback}
      </div>
    );
  }
});