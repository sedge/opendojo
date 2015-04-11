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
  Col,
  OverlayTrigger,
  Popover
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
    let valueCode = this.refs.input.getValue();

    if (valueCode.length > 0) {
      switch (valueCode.match(/^[A-Za-z0-9_-]+$/)) {
        case null:
          this.refs.userHint.show();
          break;

        default:
          this.refs.userHint.hide();
          break;
      }
    }
    else {
      this.refs.userHint.hide();
    }
    this.setState({
      value: valueCode
    });
  },

  render: function() {
    return (
      <OverlayTrigger
        ref="userHint"
        trigger="manual"
        placement="right"
        overlay={
          <Popover title='Invalid Username Format'>
            <strong>Warning!</strong> Valid user credentials only contain alphanumeric characters, as well as heifens and underscores.
          </Popover>
        }
      >
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
      </OverlayTrigger>
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
    let passValue = this.refs.input.getValue();

    if (passValue.length > 0) {
      switch (passValue.match(/^\S{6,50}$/)) {
        case null:
          this.refs.passHint.show();
          break;

        default:
          this.refs.passHint.hide();
          break;
      }
    }
    else {
      this.refs.passHint.hide();
    }
    this.setState({
      value: passValue
    });
  },

  render: function() {
    return (
      <OverlayTrigger
        ref="passHint"
        trigger="manual"
        placement="left"
        overlay={
          <Popover title='Invalid Password Format'>
            <strong>Warning!</strong> Valid passwords must be between 6 and 50 characters long, as cannot contain any whitespace.
          </Popover>
        }
      >
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
      </OverlayTrigger>
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
