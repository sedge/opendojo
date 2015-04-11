var React = require('react');
var $ = require('jquery');
var {
  isAlpha,
  isLength
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

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  render: function() {
    var ranks = this.props.ranks;

    var props = {
      label: this.props.label,
      type: "select",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value
    };

    var feedback;
    if (!this.state.valid) {
      feedback = (
        <p><strong>A rank is required.</strong></p>
      );
    }

    var ranks = Object.keys(ranks).map(function(rank){
      return (
        <option value={rank}>
          {ranks[rank]}
        </option>
      );
    });

    return (
      <div>
        <Input {...props} onChange={this.onChange}>
          <option value="" disabled defaultValue className="notDisplay">Select Rank</option>
          {ranks}
        </Input>
        {feedback}
      </div>
    );
  }
});