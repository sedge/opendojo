var React = require('react');
var {
  isNumeric,
  isLength,
  blacklist
} = require('validator');

var {
  Input
} = require('react-bootstrap');

var {
  ageCalculator,
  validateExpiryDate
} = require('../bin/utils.jsx');

var DateInput = module.exports = React.createClass({
  getInitialState: function() {
    return {
      valid: true,
      ageValid: true,
      expValid: true,
      value: this.props.defaultValue
    };
  },

  onChange: function() {
    var ref = this.refs[this.props.name];
    var value = ref.getValue().trim();

    // Allow dashes
    var sanitized = blacklist(value, "-");
    var valueDate = new Date(value);
    if (!isLength(sanitized, 1) || !isNumeric(sanitized)) {
      return this.setState({
        valid: false,
        expValid: false,
        value: value
      });
    }
    if(this.props.name == "bday"){
      if(Number(ageCalculator(valueDate)) < 3 || Number(ageCalculator(valueDate) > 100)){
        return this.setState({
          ageValid: false,
          value: value
        });
      }
    }
    if(this.props.name == "expiryDate") {
      if(!validateExpiryDate(value)) {
        return this.setState({
          expValid: false,
          value: value
        })
      }
    }

    if (!this.state.valid) {
      this.setState({
        valid: true,
        value: value
      });
    }
    if (!this.state.ageValid){
      this.setState({
        ageValid: true,
        value: value
      });
    }
    if (!this.state.expValid){
      this.setState({
        expValid: true,
        value: value
      });
    }
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  validationState: function() {
    if (this.state.valid && this.state.ageValid) {
      return;
    }
    return "error";
  },
  expValidationState: function() {
    if (this.state.expValid) {
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
    if(this.expValidationState()) {
      if(this.props.name == "expiryDate") {
        props.bsStyle = this.expValidationState();
      }
    }
    if(this.validationState()) {
      if(this.props.name == "bday") {
        props.bsStyle = this.validationState();
      }
    }

    var feedback;
    if(!this.state.ageValid && this.props.name == "bday") {
      feedback = (
        <p><strong>Age must be between 3 and 100 years</strong></p>
      );
    }
    else if (this.props.name == "expiryDate" && !this.state.expValid) {
      feedback = (
        <p><strong>A non-default expiry date is recommended, and must be scheduled between today and 2 years from now</strong></p>
      );
    }
    else {
      if(!this.state.valid && this.props.name == "bday" && this.state.ageValid){
        feedback = (
          <p><strong>A complete birth date field is required</strong></p>
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