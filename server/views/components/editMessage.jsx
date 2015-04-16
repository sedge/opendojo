var React = require('react');
var Promise = require('bluebird');
var { ListenerMixin } = require('reflux');
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
  Grid
} = require('react-bootstrap');

var EditMessage = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      empty: false,
      messageToUser: "",
      saved: false
    };
  },

  componentWillMount: function() {
    var that = this;

    // Listen for changes to message model state, immediately showing the latest message
    // through the callback
    this.listenTo(messageStore, this.showMessage, function(message) {
      that.showMessage(message);
    });

    this.listenTo(messageActions.editMessage.completed, this.editMessageComplete);
    this.listenTo(messageActions.editMessage.failed, this.editMessageFailed);
  },
  showMessage: function(message) {debugger;
    if (message.length != 0){
      var text = message[0].messageText;
      this.setState({
        messageObject: message,
        messageText: text
      });
    }
  },
  onEditMessage: function(e){debugger;
    var that = this;
    var emptyField;
    if (e) { e.preventDefault(); }

     if (this.refs.Message.getValue().trim()==''){
        emptyField= "Please provide a message";
      that.setState({
        saved: false,
        messageToUser: emptyField,
        empty: true
      });
    } else {
      var newMessage = {   
        messageText: that.refs.Message.getValue().trim()
      };
      messageActions.editMessage(newMessage);
    }
  },
  editMessageFailed:function(err) {
    this.setState({
      saved:false
    });
    console.error("Editing a message failed: ", err);
  },
  editMessageComplete: function() {
    var messageToUserText = "Your message has been saved"
    this.setState({
      messageToUser: messageToUserText,
      saved:true
    });
  },
  render: function() {debugger;
    var customMsg = this.state.messageText;
    var response;
    var submitButton;
    var alertCondition;
    if (this.state.empty || this.state.saved){
      if (!this.state.saved){
        alertCondition="danger";
      }
      else {
        alertCondition="success";
      }
      response = (
        <Alert bsStyle={alertCondition} id="alert">
          <p><strong>{this.state.messageToUser}</strong></p>
        </Alert>
      )
    }
    return (
      <div>
        <form>
          <h2> Update Message Information:</h2>
          <Input type='textarea' ref='Message' placeholder={customMsg} />
            {response}
            <Grid>
              <Row className="show-grid">
                <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditMessage}>Save</Button></Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}><Link to="students"><Button bsSize="large">Cancel</Button></Link></Col>
              </Row>
            </Grid>
        </form>
      </div>
    );
  }
});
