var React = require('react');
var $ = require('jquery');

var {
  Input
} = require('react-bootstrap');

var RankSequence = module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.defaultValue,
      feedback: ""
    };
  },

  onChange: function(e) {
    var feedbackString = "Sequence has been changed.  Remember to change the corresponding duplicate sequence."
    return this.setState({
      feedback: feedbackString
    });
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  render: function() {
    var sequences = this.props.sequences;

    var props = {
      label: this.props.label,
      type: "select",
      ref: this.props.name,
      name: this.props.name,
      defaultValue: this.state.value
    };

    var sequences = Object.keys(sequences).map(function(sequence){
      return (
        <option value={sequences[sequence]}>
          {sequences[sequence]}
        </option>
      );
    });

    return (
      <div>
        <Input {...props} onChange={this.onChange}>
          {sequences}
        </Input>
           <p className="red"><strong>{this.state.feedback}</strong></p>
      </div>
    );
  }
});