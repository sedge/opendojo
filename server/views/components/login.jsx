var React = require('react');
var {
  ListenerMixin
} = require('reflux');
var {
  Navigation
} = require('react-router');
var {
  logIn
} = require('../actions/authActions.jsx');

var authStore = require('../stores/authStore.jsx');

var {
  Form,
  Input,
  Button,
  Col
} = require('react-bootstrap');

var UserField = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },

  getValue: function() {
    return this.refs.input.getValue();
  },

  validationState: function() {
    let valueCode = this.state.value;
    if (valueCode.length > 0) {
      switch (valueCode.match(/^[A-Za-z0-9_-]+$/)) {
        case null:
          return 'warning';
          break;

        default:
          return '';
          break;
      }
    }
  },

  handleChange: function() {
    this.setState({
      value: this.refs.input.getValue()
    });
  },

  render: function() {
    return ( < Input type = 'text'
      value = {
        this.state.value
      }
      label = 'Username'
      bsStyle = {
        this.validationState()
      }
      ref = 'input'
      groupClassName = 'input-group'
      className = 'form-control'
      onChange = {
        this.handleChange
      }
      />
    );
  }
});

var PasswordField = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },

  getValue: function() {
    return this.refs.input.getValue();
  },

  validationState: function() {
    let passValue = this.state.value;

    if (passValue.length > 0) {
      switch (passValue.match(/^\S{6,50}$/)) {
        case null:
          return 'warning';
          break;

        default:
          return '';
          break;
      }
    }
  },

  handleChange: function() {
    this.setState({
      value: this.refs.input.getValue()
    });
  },

  render: function() {
    return ( < Input type = 'password'
      value = {
        this.state.value
      }
      label = 'Password'
      bsStyle = {
        this.validationState()
      }
      ref = 'input'
      groupClassName = 'input-group'
      className = 'form-control'
      onChange = {
        this.handleChange
      }
      />
    );
  }
});

var LoginUI = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],

  handleSubmit: function() {
    logIn({
      username: this.refs.userVal.getValue(),
      password: this.refs.passVal.getValue()
    });
  },

  logInCompleted: function() {
    this.transitionTo('/');
  },

  logInFailed: function(err) {
    console.log('Log in failed! ', err);
    this.transitionTo('/');
  },

  render: function() {
    return (
      <div id="loginForm">
        <Col xs={7} xsOffset={5}>
          <UserField ref="userVal" / >
          <PasswordField ref="passVal" / >
          <Button onClick={this.handleSubmit}>Submit</Button>
        </Col>
      </div>
    );
  }
});
