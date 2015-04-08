var Reflux = require('reflux');
var request = require('superagent');
var { ListenerMixin } = require('reflux');

var rankActions = require('../actions/rankActions.jsx');
var {
  addRank,
  editRank,
  deleteRank
} = rankActions;

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
  listenables: [authActions, rankActions],
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
  },

  getSequence: function(){
    var lastSequence = ranks[ranks.length - 1];
    var highestSequence = 0;
    for (var i=0; i<ranks.length; i++)
    {
      if (ranks[i].sequence > highestSequence) {
        highestSequence = ranks[i].sequence;
      }
    }
    var sequenceToAdd = highestSequence + 1;
    return sequenceToAdd;
  },

  // `addRank` Action handling
  addRank: function(data){debugger;
    var that = this;

    var newRank = {
      name: data.name,
      sequence: data.sequence,
      color: data.color,
    };

    request
      .post(URL + 'ranks')
      .set(authInfo)
      .send(newRank)
      .end(function(err, res){
        if(err){
          return addRank.failed("API Error: " + err);
        }

        ranks.push(res.body);
        addRank.completed(ranks);
      });
  },
  addRankFailed: function() {
    this.trigger(ranks);
  },
  addRankCompleted: function() {
    this.trigger(ranks);
  },

  // `editRank` Action handling
  editRank: function(updatedInfo){
    var that = this;

    var rank;
    var index;

    for(var i = 0; i < ranks.length; i++){
      if(ranks[i]._id == updatedInfo._id) {
        rank = ranks[i];
        index = i;
        break;
       }
    }

      if(!rank) {
      return editRank.failed(ranks);
    }
    var rankToSend = {
      name: updatedInfo.name,
      sequence: updatedInfo.sequence,
      color: updatedInfo.color
    }
    request
      .put(URL + "rank/" + updatedInfo._id)
      .set(authInfo)
      .send(rankToSend)
      .end(function(err, res) {
        if(err){
          return editRank.failed(err);
        }

        ranks[index] = updatedInfo;
        editRank.completed(ranks);
      });
  },
  editRankFailed: function() {
    this.trigger(ranks)
  },
  editRankCompleted: function() {
    this.trigger(ranks);
  },

  // `deleteRank` Action handling
  deleteRank: function(id){
    var that = this;

    var rank;
    var index;

    for(var i = 0; i < ranks.length; i++){
      if(ranks[i]._id == id) {
        rank = ranks[i];
        index = i;
        break;
      }
    }

    if (!rank) {
      return deleteRank.failed("Cannot delete a non-existant rank");
    }

    request
      .del(URL + "rank/" + id)
      .set(authInfo)
      .end(function(err, res){
        if (err) {
          return deleteRank.failed("API Error: " + err.toString());
        }

        // A delete returns 204 no matter what,
        // so we attempt a get request on the student
        // to confirm it was deleted
        request
          .get(URL + "rank/" + id)
          .end(function(err, res) {
            if (err) {
              return deleteRank.failed("API Error: " + err.toString());
            }

            ranks.splice(index, 1);
            deleteRank.completed(ranks);
          });
      });
  },
  deleteRankFailed: function() {
    // Delete Error handling goes here
    this.trigger(ranks);
  },
  deleteRankCompleted: function() {
    // Delete success handling goes here
    this.trigger(ranks);
  }
});

module.exports = rankStore;
