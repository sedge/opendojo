var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var StudentActions = module.exports = Reflux.createActions({
	addStudent: {
    asyncResult: true
  },
	editStudent: {
    asyncResult: true
  },
	deleteStudent: {
    asyncResult: true
  }
});


