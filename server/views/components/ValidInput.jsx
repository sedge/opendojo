var React = require('react');

var {
  Input
} = require('react-bootstrap');

var ValidInput = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      invalid: false
    };
  },

  toggleInvalid: function(){
    this.setState({
      invalid: !this.state.invalid,
      invalidMessage: "Oops, something went wrong!"
    });
  },

  // Get value from the ref
  getValue: function() {
    return this.refs[this.props.name].getValue();
  },

  render: function() {
    var classes = {};
    var feedback;

    if (!this.state.valid) {
      // Set invalid classes
      feedback = (
        <p><strong>{this.state.invalidMessage}</strong></p>
      )
    }

    return (
      <div>
        {feedback}
        <Input label={this.props.label} type={this.props.type} ref={this.props.name} name={this.props.name} defaultValue={this.props.defaultValue} />
      </div>
    );
  }
});