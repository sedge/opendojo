var Reflux = require('reflux');
var request = require('superagent');
var { ListenerMixin } = require('reflux');

var messageActions = require('../actions/messageActions.jsx');
var {
  editMessage
} = messageActions;

var authActions = require('../actions/authActions.jsx');
var authStore = require('../stores/authStore.jsx');

var {
  logIn
} = authActions;

var { URL } = require('../bin/constants.jsx');

var id = 0;

var messages = [];

var authInfo;

var messageStore = Reflux.createStore({
  listenables: [messageActions, authActions],
  mixins: [ListenerMixin],

  // Initialize the store
  init: function(){
    var that = this;

    this.listenTo(authStore, this.authUpdate, this.authUpdate);
    request
      .get(URL + 'message')
      .set(authInfo)
      .end(function(err,res){
        if (err) {
          console.error("Error initializing the messageStore: ", err);
        }

        if(res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }
        if (res.body && res.body.length && res.body.length > 0) {
          messages = res.body;
        }
        that.trigger(messages);
    });
  },
  // Initial getter for anything listening to
  // this store
  getInitialState: function() {
    return messages;
  },


  // `editMessage` Action handling
  editMessage: function(updatedInfo){
    var that = this;
    if (!messages){
      return editMessage.failed(messages);
    }
    request
      .put(URL + "message/")
      .set(authInfo)
      .send(updatedInfo)
      .end(function(err, res) {
        if(err){
          return editMessage.failed(err);
        }
        var messageArray = [];
        messageArray.push(updatedInfo);
        messages = messageArray;
        editMessage.completed(messages);
      });
  },
  editMessageFailed: function() {
    this.trigger(messages)
  },
  editMessageCompleted: function() {
    this.trigger(messages);
  },
  authUpdate: function(latestToken) {
    var that = this;

    authInfo = {
        "x-access-token": latestToken
    };

    request
      .get(URL + "message")
      .set(authInfo)
      .end(function(err,res){
        if (err) {
          console.error("Error initializing the messageStore: ", err);
        }

        if(res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        if (res.body && res.body.length && res.body.length > 0) {
          messages = res.body;
        }
        that.trigger(messages);
    });
  }
});

module.exports = messageStore;
