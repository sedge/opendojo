var Reflux = require('reflux');
var request = require('superagent');
var { ListenerMixin } = require('reflux');

var { URL } = require('../bin/constants.jsx');

var id = 0;

var ranks = [];

var authActions = require('../actions/authActions.jsx');
var authStore = require('../stores/authStore.jsx');

var {
  logIn
} = authActions;

var authInfo;

var rankStore = Reflux.createStore({
  listenables: authActions,
  mixins: [ListenerMixin],

  init: function() {
    this.listenTo(authStore, this.authUpdated, this.authUpdated);
  },

  // Initial getter for anything listening to
  // this store
  getInitialState: function() {
    return ranks;
  },

  authUpdated: function(latestToken) {
    var that = this;

    authInfo = {
      "x-access-token": latestToken
    };

    request
      .get(URL + 'ranks')
      .set(authInfo)
      .end(function (err, res) {
        if (err) {
          console.error("Error initializing the rankStore: ", err);
        }

        // Force a re-render on app.jsx to the login screen in case of invalid auth
        if (res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        if (res.body && res.body.length && res.body.length > 0) {
          ranks = res.body;
        }

        that.trigger(ranks);
    });
  }
});

module.exports = rankStore;
