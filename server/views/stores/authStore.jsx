var Reflux = require('reflux');
var request = require('superagent');
var {authURL} = require('../bin/constants.jsx');
var { ListenerMixin } = require('reflux');

var authActions = require('../actions/authActions.jsx');
var {
  logIn
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
        logIn.completed(token);
      }
    );
  }
});

module.exports = authStore;
