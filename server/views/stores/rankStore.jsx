var Reflux = require('reflux');
var request = require('superagent');

var { URL } = require('../bin/constants.jsx');

var id = 0;

var ranks = [];

var rankStore = Reflux.createStore({
	init: function(){
    var that = this;
    var processedRanks = {};

    request.get(URL + 'ranks').end(function(err,res){
      if (err) {
        console.error("Error initializing the rankStore: ", error);
      }

      if (res.body && res.body.length && res.body.length > 0) {
        ranks = res.body;
      }

      that.trigger(ranks);
    });
	},
  // Initial getter for anything listening to
  // this store
  getInitialState: function() {
    return ranks;
  }
});

module.exports = rankStore;

