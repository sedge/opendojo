var Reflux = require('reflux');
var request = require('superagent');


var studentActions = require('../actions/studentActions.jsx');
var {
  addStudent,
  editStudent,
  deleteStudent
} = studentActions;

var { URL } = require('../bin/constants.jsx');

var id = 0;

var students = [];

var studentStore = Reflux.createStore({

	listenables: studentActions,

  // Initialize the store
	init: function(){
    var that = this;

    request.get(URL + 'students').end(function(err,res){
      if (err) {
        console.error("Error initializing the studentStore: ", error);
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

      rankId: parseInt(data.rankId, 10),
      healthInformation: data.healthInformation,
      guardianInformation: data.guardianInformation,
      email: data.email,
      membershipExpiry: new Date(),
      phone: data.phone,
      birthDate: data.birthDate
    };

    request
      .post(URL + 'students')
      .send(newStudent)
      .end(function(err, res){
        if(err){
          return addStudent.failed(err);
        }

        students.push(newStudent);
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

    request
      .put(URL + "student/" + updatedInfo._id)
      .send(updatedInfo)
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
      .end(function(err, res){
        if (err) {
          return deleteStudent.failed("API Error: " + err.toString());
        }

        // A delete returns 204 no matter what,
        // so we attempt a get request on the student
        // to confirm it was deleted
        request
          .get(URL + "student/" + id)
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
  }
});

module.exports = studentStore;

