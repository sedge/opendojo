var React = require('react');
var {
  Alert,
  Button
} = require('react-bootstrap');

var AlertDismissable = module.exports = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: this.props.visable
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      alertVisible: newProps.visable
    });
  },

  render: function() {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
          <h4>Have you checked it twice?</h4>
          <p>See those coloured fields? Make sure your data is valid before clicking save!</p>
        </Alert>
      );
    }

    return (
      <div></div>
    );
  },

  handleAlertDismiss: function() {
    this.setState({alertVisible: false});
  },

  handleAlertShow: function() {
    this.setState({alertVisible: true});
  }
});
