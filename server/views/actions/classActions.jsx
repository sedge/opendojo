var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var ClassActions = module.exports = Reflux.createActions({
  addClass: {
    asyncResult: true
  },
  editClass: {
    asyncResult: true
  },
  deleteClass: {
    asyncResult: true
  }
});

