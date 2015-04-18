var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var MessageActions = module.exports = Reflux.createActions({
  editMessage: {
    asyncResult: true
  },
});

