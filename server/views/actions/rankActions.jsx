var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var RankActions = module.exports = Reflux.createActions({
  addRank: {
    asyncResult: true
  },
  editRank: {
    asyncResult: true
  },
  editSequence: {
    asyncResult: true
  },
  deleteRank: {
    asyncResult: true
  }
});
