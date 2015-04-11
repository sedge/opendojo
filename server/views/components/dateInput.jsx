var React = require('react');
var $ = require('jquery');
var {
  isNumeric,
  isLength,
  blacklist
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

    // Allow dashes
    var sanitized = blacklist(value, "-")

    if (!isLength(sanitized, 1) || !isNumeric(sanitized)) {
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
      type: "date",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value
    };
    if (this.validationState()) {
      props.bsStyle = this.validationState();
    }

    var feedback;
    if (!this.state.valid) {
      if(this.props.name == "bday"){
        feedback = (
          <p><strong>A birth date is required.</strong></p>
        );
      }
      else{
        feedback = (
          <p><strong>A expriey date is required.</strong></p>
        );
      }
    }

    return (
      <div>
        <Input {...props} onChange={this.onChange} />
        {feedback}
      </div>
    );
  }
});