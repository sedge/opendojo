var React = require('react');
var $ = require('jquery');
var {
  isEmail,
  isLength,
  normalizeEmail
} = require('validator');

var {
  Input
} = require('react-bootstrap');

var FirstName = module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true,
      value: this.props.defaultValue
    };
  },

  onChange: function(e) {
    var ref = this.refs[this.props.name];
    var value = ref.getValue().trim();
    var sanitized = normalizeEmail(value);

    if (this.props.allowEmpty && isLength(value, 0, 0)) {
      return this.setState({
        valid: true,
        value: value
      });
    }

    if (!isEmail(sanitized)) {
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
      readOnly: this.props.readOnly,
      defaultValue: this.state.value,
      placeholder: this.props.placeholder
    };
    if (this.validationState()) {
      props.bsStyle = this.validationState();
    }
    if (this.props.disabled) {
      props.disabled = true;
    }


    var feedback;
    if (!this.state.valid) {
      feedback = (
        <p><strong>A valid email address is required</strong></p>
      );
    }

    return (
      <div>
        <Input className="form-disabled" {...props} onChange={this.onChange} />
        {feedback}
      </div>
    );
  }
});
