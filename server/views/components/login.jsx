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
    return (
      <Input
        type = 'text'
        value = {this.state.value}
        label = 'Username'
        bsStyle = {this.validationState()}
        ref = 'input'
        groupClassName = 'input-group'
        className = 'form-control'
        onChange = {this.handleChange}
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
    return (
      <Input
        type = 'password'
        value = {this.state.value}
        label = 'Password'
        bsStyle = {this.validationState()}
        ref = 'input'
        groupClassName = 'input-group'
        className = 'form-control'
        onChange = {this.handleChange}
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

  componentDidMount: function() {
    window.addEventListener('keypress', this.handleKeyPress);
  },

  // Attempt to submit on 'ENTER' (keycode 13)
  handleKeyPress: function(e) {
    if(e.keyCode == 13) {
      this.handleSubmit();
    }
  },

  logInCompleted: function() {
    this.transitionTo('/');
  },

  logInFailed: function(err) {
    console.log('Log in failed! ', err);
    this.transitionTo('/');
  },

  componentWillUnmount: function() {
    window.removeEventListener('keypress', this.handleKeyPress);
  },

  render: function() {
    return (
      <div id="loginForm" ref="loginComp">
        <br />
        <Col xs={7} xsOffset={5}>
          <UserField ref="userVal" />
          <PasswordField ref="passVal" />
        </Col>
        <Col xs={6} xsOffset={6}>
          <br />
          <Input
            type='submit'
            className='btn btn-default'
            bsSize='large'
            onClick={this.handleSubmit}
            value='Submit'
          />
        </Col>
      </div>
    );
  }
});
