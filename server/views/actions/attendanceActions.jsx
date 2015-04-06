var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var AttendanceActions = module.exports = Reflux.createActions({
  deleteAttendance: {
    asyncResult: true
  }
});

