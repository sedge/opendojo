var React = require('react');
var $ = require('jquery');

var {
  Input
} = require('react-bootstrap');

var RankSequence = module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.defaultValue
    };
  },

  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  render: function() {
    var sequences = this.props.sequences;

    var props = {
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
        <Input {...props}>
          {sequences}
        </Input>
      </div>
    );
  }
});