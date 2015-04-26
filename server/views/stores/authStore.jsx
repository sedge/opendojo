var Reflux = require('reflux');
var request = require('superagent');
var {authURL} = require('../bin/constants.jsx');
var { ListenerMixin } = require('reflux');

var tokenDecoder = require('jwt-decode');

var authActions = require('../actions/authActions.jsx');
var {
  logIn,
  validate
} = authActions;

var token = localStorage["token"];

var authStore = Reflux.createStore({
  listenables: authActions,
  mixins: [ListenerMixin],

  getInitialState: function() {
    return token;
  },

  init: function() {
    this.listenTo(logIn.completed, this.logInCompleted, this.logInCompleted);
  },

  logInCompleted: function(latestToken) {
    token = latestToken;
    localStorage.setItem("token", token);

    this.trigger(token);
  },

  logIn: function(auth) {
    var options = {
        username: auth.username,
        password: auth.password
    };

    request
      .get(authURL + '/token')
      .set(options)
      .end(function(err, res) {
        if (err) {
          return logIn.failed(err);
        }

        if (res.statusCode == 401) {
          return logIn.failed('Authentication failed', res.statusCode);
        }

        token = res.body.token;
        var validUser = auth.username;

        logIn.completed(token, validUser);
      }
    );
  },

  validate: function(password) {
    var decodedToken = tokenDecoder(token);

    var options = {
      username: decodedToken.username,
      password: password
    };

    request
      .get(authURL + '/token')
      .set(options)
      .end(function(err, res) {
        if (err) {
          return validate.failed(err);
        }

        if (res.statusCode == 401) {
          return validate.failed('Authentication failed', res.statusCode);
        }

        validate.completed(token);
      }
    );
  },

  validateCompleted: function(newToken) {
    // Destroy the new token
    newToken = null;

    this.trigger(token);
  },

  validateFailed: function(err) {
    this.trigger(token);
  }
});

module.exports = authStore;
