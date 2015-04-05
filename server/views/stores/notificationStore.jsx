var Reflux = require('reflux');
var request = require('superagent');

var UUID = require('uuid').v4;

var { ListenerMixin } = require('reflux');

var authStore = require('./authStore.jsx');
var studentStore = require('./studentStore.jsx');

var actions = require('../actions/notificationActions.jsx');

var { URL } = require('../bin/constants.jsx');


var students = [];
var recipients = [];
var authInfo;

var notificationStore = Reflux.createStore({
  listenables: actions,
  mixins: [ListenerMixin],

  init: function() {
    this.listenTo(studentStore, this.handleStudents, this.handleStudents);
    this.listenTo(authStore, this.authUpdate, this.authUpdate);
  },

  handleStudents: function(newStudents) {
    students = newStudents.map(function(student) {
      return {
        _id: student._id,
        email: student.email,
        name: student.lastName + ", " + student.firstName
      };
    });
  },

  addRecipient: function(payload) {
    var recipient;

    // If it's a custom email, create the recipient
    // manually
    if(!payload.studentId && payload.email) {
      recipient = {
        _id: UUID(),
        email: [payload.email],
        name: payload.email.split("@")[0]
      };

      recipients.push(recipient);
      return this.trigger({
        recipients: recipients,
        flag: null
      });
    }

    students.forEach(function(student) {
      if (student._id === payload.studentId) {
        recipient = student;
      }
    });

    recipients.push(recipient);
    this.trigger({
      recipients: recipients,
      flag: null
    });
  },

  addAllRecipients: function() {
    recipients = students;
    this.trigger({
      recipients: recipients,
      flag: null
    });
  },

  removeRecipient: function(studentId) {
    var toBeRemoved;

    recipients.forEach(function(recipient, index){
      if (recipient._id === studentId) {
        recipients.splice(index, 1);
      }
    });

    this.trigger({
      recipients: recipients,
      flag: null
    });
  },

  removeAllRecipients: function() {
    recipients = [];

    this.trigger({
      recipients: recipients,
      flag: null
    });
  },

	sendNotification: function(data){
    var emails = data.recipients.map(function(recipient){
      return recipient.email[0];
    });

    var notification = {
      message: data.message,
      subject: data.subject,
      recipients: emails
    };

    request
      .post(URL + 'email')
      .set(authInfo)
      .send(notification)
      .end(function(err, res){
        if(err){
          return actions.sendNotification.failed(err);
        }

        actions.sendNotification.completed();
      });
	},
  sendNotificationFailed: function() {
    this.trigger({
      flag: "failed"
    });
  },
  sendNotificationCompleted: function() {
    recipients = [];
    this.trigger({
      flag: "succeeded",
      recipients: recipients
    });
  },

  authUpdate: function(latestToken) {
    authInfo = {
      "x-access-token": latestToken
    };
  }
});

module.exports = notificationStore;

