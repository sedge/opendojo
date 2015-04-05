var Reflux = require('reflux');
Reflux.setPromise(require('bluebird'));

var NotificationActions = module.exports = Reflux.createActions({
  "addRecipient": {
    asyncResult: false
  },
  "addAllRecipients": {
    asyncResult: false
  },
  "removeRecipient": {
    asyncResult: false
  },
  "removeAllRecipients": {
    asyncResult: false
  },
  "sendNotification": {
    asyncResult: true
  }
});

