var React = require('react');
var $ = require('jquery');
var {
  isAlpha,
  isLength
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
    var value = ref.getValue();

    if (!isLength(value, 1) || !isAlpha(value)) {
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
      return "success";
    }
    return "error";
  },

  render: function() {
    var props = {
      label: this.props.label,
      type: this.props.type,
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value
    };
    props.bsStyle = this.validationState();

    var feedback;
    if (!this.state.valid) {
      feedback = (
        <p><strong>A first name is required, and must only be letters.</strong></p>
      );
    }

    return (
      <div>
        {feedback}
        <Input {...props} onChange={this.onChange} />
      </div>
    );
  }
});