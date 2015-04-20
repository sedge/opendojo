var React = require('react');

var Reflux = require('reflux');

var {
  Navigation,
  RouteHandler,
  Link
} = require('react-router');
var messageActions = require('../actions/messageActions.jsx');
var messageStore = require('../stores/messageStore.jsx');
var {
  Alert,
  Button,
  Input,
  Row,
  Col,
  Grid,
  Panel
} = require('react-bootstrap');

var TerminalSettings = module.exports = React.createClass({
  mixins: [
    Navigation,
    Reflux.connectFilter(messageStore, "customMessage", function(message) {
      if (message.length != 0){
        var text = message[0].messageText;
        return text;
      }
    }),
    Reflux.listenTo(messageActions.editMessage.completed, "editMessageComplete"),
    Reflux.listenTo(messageActions.editMessage.failed, "editMessageFailed")
  ],

  getInitialState: function() {
    return {
      empty: false,
      messageToUser: "",
      saved: false,
    };
  },

  onEditMessage: function(e){
    if (e) { e.preventDefault(); }

    if (this.state.empty){
      return this.setState({
        messageToUser: "Please provide a message",
      });
    }

    messageActions.editMessage({
      messageText: this.state.customMessage
    });
  },
  onChange: function(e) {
    var value = this.refs.Message.getValue();
    var newState = {
      customMessage: value,
      saved: false,
      empty: false
    };
    if (value.trim().length <= 0) {
      newState.empty = true;
      newState.messageToUser = "Please provide a message";
    }

    this.setState(newState);
  },
  editMessageFailed:function(err) {
    console.error("Editing a message failed: ", err);
    this.setState({
      saved:false
    });
  },
  editMessageComplete: function() {
    this.setState({
      messageToUser: "Your message has been saved",
      saved:true
    });
  },
  render: function() {
    var response;
    var submitButton;
    var alertCondition;

    var inputProps = {
      label: 'Custom Announcement',
      type: 'text',
      ref: 'Message',
      value: this.state.customMessage,
      placeholder: "Put your message here!",
      onChange: this.onChange
    };

    if (this.state.empty){
      response = (
        <Alert bsStyle="danger">
          <p><strong>{this.state.messageToUser}</strong></p>
        </Alert>
      )
    } else if (this.state.saved) {
      response = (
        <Alert bsStyle="success">
          <p><strong>{this.state.messageToUser}</strong></p>
        </Alert>
      )
    }
    return (
      <div>
        <Panel header="Terminal Configuration">
          <Row>
            <Col md={12}>
              <Input {...inputProps} />
              {response}
            </Col>
          </Row>
          <Row>
            <Col md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditMessage}>Save</Button></Col>
            <Col md={1} mdOffset={6}><Link to="students"><Button bsSize="large">Cancel</Button></Link></Col>
          </Row>
        </Panel>
      </div>
    );
  }
});
