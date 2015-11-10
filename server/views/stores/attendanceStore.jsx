/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var Reflux = require('reflux');
var request = require('superagent');
var { ListenerMixin } = require('reflux');

var attendanceActions = require('../actions/attendanceActions.jsx');
var {
  deleteAttendance,
  addAttendance
} = attendanceActions;

var { URL } = require('../bin/constants.jsx');

var id = 0;

var attendances = [];

var authActions = require('../actions/authActions.jsx');
var authStore = require('../stores/authStore.jsx');

var {
  logIn
} = authActions;

var authInfo;

var attendanceStore = Reflux.createStore({
  listenables: [attendanceActions, authActions],
  mixins: [ListenerMixin],

  init: function(){
    // Initialize the store
    this.listenTo(authStore, this.authUpdated, this.authUpdated);
  },

  // Initial getter for anything listening to
  // this store
  getInitialState: function() {
    return attendances;
  },

  authUpdated: function(latestToken) {
    var that = this;

    authInfo = {
      "x-access-token": latestToken
    };

    request
      .get(URL + 'records')
      .set(authInfo)
      .end(function (err, res) {
        if (err) {
          console.error("Error initializing the attendanceStore: ", err);
        }
        // Force a re-render on app.jsx to the login screen in case of invalid auth
        if (res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        if (res.body && res.body.length && res.body.length > 0) {
          attendances = res.body;
        }

        that.trigger(attendances);
    });
  },

  // `addAttendance` Action handling
  addAttendance: function(data){
    var that = this;

    var newAttendance = {
      studentID: data.studentID,
      classDate: data.classDate,
      classTime: data.classTime,
      classID:   data.classID
    };

    request
      .post(URL + 'records')
      .set(authInfo)
      .send(newAttendance)
      .end(function(err, res){
        if(err){
          return addAttendance.failed("API Error: " + err);
        }

        // Force a re-render on app.jsx to the login screen in case of invalid auth
        if(res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        attendances.push(res.body);
        addAttendance.completed(attendances);
      });
  },
  addAttendanceFailed: function() {
    this.trigger(attendances);
  },
  addAttendanceCompleted: function() {
    this.trigger(attendances);
  },

  // `editAttendance` Action handling
  editAttendance: function(updatedInfo){
    var that = this;

    var attendance;
    var index;

    for(var i = 0; i < attendances.length; i++){
      if(attendances[i]._id == updatedInfo._id) {
        attendance = attendances[i];
        index = i;
        break;
       }
    }

    if(!attendance) {
      return editAttendance.failed(attendances);
    }

    var attendanceToSend = {
      studentID: updatedInfo.studentID,
      classDate: updatedInfo.classDate,
      classTime: updatedInfo.classTime,
      classID:   updatedInfo.classID
    }
    request
      .put(URL + "record/" + updatedInfo._id)
      .set(authInfo)
      .send(attendanceToSend)
      .end(function(err, res) {
        if(err){
          return editAttendance.failed(err);
        }

        attendances[index] = updatedInfo;
        editAttendance.completed(attendances);
      });
  },
  editAttendanceFailed: function() {
    this.trigger(attendances)
  },
  editAttendanceCompleted: function() {
    this.trigger(attendances);
  },

  // `deleteAttendance` Action handling
  deleteAttendance: function(id){
    var that = this;

    var attendance;
    var index;

    for(var i = 0; i < attendances.length; i++){
      if(attendances[i]._id == id) {
        attendance = attendances[i];
        index = i;
        break;
      }
    }

    if (!attendance) {
      return deleteAttendance.failed("Cannot delete a non-existant record");
    }

    request
      .del(URL + "record/" + id)
      .set(authInfo)
      .end(function(err, res){
        if (err) {
          return deleteAttendance.failed("API Error: " + err.toString());
        }

        // A delete returns 204 no matter what,
        // so we attempt a get request on the attendance
        // to confirm it was deleted
        request
          .get(URL + "record/" + id)
          .set(authInfo)
          .end(function(err, res) {
            if (err) {
              return deleteAttendance.failed("API Error: " + err.toString());
            }

            attendances.splice(index, 1);
            deleteAttendance.completed(attendances);
          });
      });
  },
  deleteAttendanceFailed: function() {
    // Delete Error handling goes here
    this.trigger(attendances);
  },
  deleteAttendanceCompleted: function() {
    // Delete success handling goes here
    this.trigger(attendances);
  }
});

module.exports = attendanceStore;
