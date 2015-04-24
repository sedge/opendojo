var Reflux = require('reflux');
var request = require('superagent');
var { ListenerMixin } = require('reflux');

var studentActions = require('../actions/studentActions.jsx');
var {
  addStudent,
  editStudent,
  deleteStudent
} = studentActions;

var authActions = require('../actions/authActions.jsx');
var authStore = require('../stores/authStore.jsx');

var {
  logIn
} = authActions;

var { URL } = require('../bin/constants.jsx');

var id = 0;

var students = [];

var authInfo;

var studentStore = Reflux.createStore({
  listenables: [studentActions, authActions],
  mixins: [ListenerMixin],

  // Initialize the store
	init: function(){
    var that = this;

    this.listenTo(authStore, this.authUpdate, this.authUpdate);
    request
      .get(URL + 'students')
      .set(authInfo)
      .end(function(err,res){
        if (err) {
          console.error("Error initializing the studentStore: ", err);
        }

        if(res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        if (res.body && res.body.length && res.body.length > 0) {
          students = res.body;
        }
        that.trigger(students);
    });
	},
  // Initial getter for anything listening to
  // this store
  getInitialState: function() {
    return students;
  },

  // `addStudent` Action handling
	addStudent: function(data){
    var that = this;
    var newStudent = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      rankId: data.rankId,
      healthInformation: data.healthInformation,
      guardianInformation: data.guardianInformation,
      email: data.email,
      membershipExpiry: data.expiryDate,
      phone: data.phone,
      birthDate: data.birthDate,
      emergencyphone: data.emergencyphone
    };

    request
      .post(URL + 'students')
      .set(authInfo)
      .send(newStudent)
      .end(function(err, res){
        if(err){
          return addStudent.failed(err);
        }

        // Force a re-render on app.jsx to the login screen in case of invalid auth
        if(res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        students.push(res.body);
        addStudent.completed(students);
      });
	},
  addStudentFailed: function() {
    this.trigger(students);
  },
  addStudentCompleted: function() {
    this.trigger(students);
  },

  // `editStudent` Action handling
	editStudent: function(updatedInfo){
    var that = this;

    var student;
    var index;

    for(var i = 0; i < students.length; i++){
      if(students[i]._id == updatedInfo._id) {
        student = students[i];
        index = i;
        break;
      }
    }

    if(!student) {
      return editStudent.failed(students);
    }
     var studentToSend = {
      firstName: updatedInfo.firstName,
      lastName: updatedInfo.lastName,
      gender: updatedInfo.gender,
      rankId: updatedInfo.rankId,
      healthInformation: updatedInfo.healthInformation,
      emergencyphone: updatedInfo.emergencyphone,
      guardianInformation: updatedInfo.guardianInformation,
      email: updatedInfo.email,
      membershipStatus: updatedInfo.membershipStatus,
      membershipExpiry: updatedInfo.membershipExpiry,
      phone: updatedInfo.phone,
      birthDate: updatedInfo.birthDate
    }

    request
      .put(URL + "student/" + updatedInfo._id)
      .set(authInfo)
      .send(studentToSend)
      .end(function(err, res) {
  			if(err){
          return editStudent.failed(err);
        }

        students[index] = updatedInfo;
        editStudent.completed(students);
      });
	},
  editStudentFailed: function() {
    this.trigger(students)
  },
  editStudentCompleted: function() {
    this.trigger(students);
  },

  // `deleteStudent` Action handling
	deleteStudent: function(id){
    var that = this;

    var student;
    var index;

    for(var i = 0; i < students.length; i++){
      if(students[i]._id == id) {
        student = students[i];
        index = i;
        break;
      }
    }

    if (!student) {
      return deleteStudent.failed("Cannot delete non-existant student");
    }

    request
      .del(URL + "student/" + id)
      .set(authInfo)
      .end(function(err, res){
        if (err) {
          return deleteStudent.failed("API Error: " + err.toString());
        }

        // A delete returns 204 no matter what,
        // so we attempt a get request on the student
        // to confirm it was deleted
        request
          .get(URL + "student/" + id)
          .set(authInfo)
          .end(function(err, res) {
            if (res.text != "Invalid data!") {
              return deleteStudent.failed("API Error: " + err.toString());
            }

            students.splice(index, 1);
		        deleteStudent.completed(students);
          });
      });
  },
  deleteStudentFailed: function() {
    // Delete Error handling goes here
    this.trigger(students);
  },
  deleteStudentCompleted: function() {
    // Delete success handling goes here
    this.trigger(students);
  },

  authUpdate: function(latestToken) {
    var that = this;

    authInfo = {
        "x-access-token": latestToken
    };

    request
      .get(URL + 'students')
      .set(authInfo)
      .end(function(err,res){
        if (err) {
          console.error("Error initializing the studentStore: ", err);
        }

        if(res.statusCode == 401 || res.text == "Access token has expired") {
          return logIn.failed(res.text, res.statusCode);
        }

        if (res.body && res.body.length && res.body.length > 0) {
          students = res.body;
        }
        that.trigger(students);
    });
  }
});

module.exports = studentStore;
