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
      value: '',
      invalid: false
    };
  },

  getValue: function() {
    return this.refs.input.getValue();
  },

  validationState: function() {
    let valueCode = this.state.value;
    if (valueCode.length > 0) {
      switch (valueCode.match(/^[A-Za-z0-9_-]{1,40}$/)) {
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
      switch (valueCode.match(/^[A-Za-z0-9_-]{1,40}$/)) {
        case null:
          this.setState({
            invalid: true,
            value: valueCode
          }, this.props.onChange);

          this.refs.userHint.show();
          break;

        default:
          this.setState({
            invalid: false,
            value: valueCode
          }, this.props.onChange);

          this.refs.userHint.hide();
          break;
      }
    }
    else {
      this.setState({
        value: valueCode
      }, this.props.onChange);

      this.refs.userHint.hide();
    }
  },

  render: function() {
    return (
      <OverlayTrigger
        ref="userHint"
        trigger="manual"
        placement="right"
        overlay={
          <Popover title='Invalid Username Format'>
            <strong className='warnText'>Warning!</strong> Valid usernames must be between 1 and 40 characters. Characters can be alphanumeric, hyphens, and underscores.
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
          hasFeedback
        />
      </OverlayTrigger>
    );
  }
});

var PasswordField = React.createClass({
  getInitialState: function() {
    return {
      value: '',
      invalid: false
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
          this.setState({
            invalid: true,
            value: passValue
          }, this.props.onChange);

          this.refs.passHint.show();
          break;

        default:
          this.setState({
            invalid: false,
            value: passValue
          }, this.props.onChange);

          this.refs.passHint.hide();
          break;
      }
    }
    else {
      this.setState({
        value: passValue
      }, this.props.onChange);

      this.refs.passHint.hide();
    }
  },

  render: function() {
    return (
      <OverlayTrigger
        ref="passHint"
        trigger="manual"
        placement="left"
        overlay={
          <Popover title='Invalid Password Format'>
            <strong className='warnText'>Warning!</strong> Valid passwords must be between 6 and 50 characters long, and cannot contain any whitespace.
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
          hasFeedback
        />
      </OverlayTrigger>
    );
  }
});

var LoginUI = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],

  getInitialState: function() {
    return {
      invalid: true
    }
  },

  componentDidMount: function() {
    window.addEventListener('keypress', this.handleKeyPress);
  },

  handleChange: function() {
    var isInvalid = false;

    var unameState = this.refs.userVal.state.invalid;
    var pwordState = this.refs.passVal.state.invalid;
    var unameLength = this.refs.userVal.getValue().length;
    var pwordLength = this.refs.passVal.getValue().length;

    if(unameState
       || (unameLength == 0)
       || pwordState
       || (pwordLength == 0)) {
      isInvalid = true;
    }

    this.setState({
      invalid: isInvalid
    });
  },

  handleSubmit: function() {
    logIn({
      username: this.refs.userVal.getValue(),
      password: this.refs.passVal.getValue()
    });
  },

  // Attempt to submit on 'ENTER' (keycode 13)
  handleKeyPress: function(e) {
    if(e.keyCode == 13) {
      if(this.state.invalid == true){
        return;
      }

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
        <Col xs={7} xsOffset={5} className="credContainer">
          <UserField ref="userVal" onChange={this.handleChange} />
          <PasswordField ref="passVal" onChange={this.handleChange} />
        </Col>
        <Col xs={6} xsOffset={6}>
          <br />
          <Input
            type='submit'
            className='btn btn-default'
            bsSize='large'
            onClick={this.handleSubmit}
            disabled={this.state.invalid}
            value={this.state.invalid ? 'N/A' : 'Submit'}
          />
        </Col>
      </div>
    );
  }
});
