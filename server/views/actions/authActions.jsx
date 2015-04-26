var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var AuthActions = module.exports = Reflux.createActions({
  logIn: {
    asyncResult: true
  },
  validate: {
    asyncResult: true
  }
});
