var Reflux = require('reflux');
var request = require('superagent');

<<<<<<< HEAD
var studentAction = require('../actions/studentActions.jsx');
=======
var studentActions = require('../actions/studentActions.jsx');
var {
  addStudent,
  editStudent,
  deleteStudent
} = studentActions;
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985

var { URL } = require('../bin/constants.jsx');

var id = 0;

var students = [];

var studentStore = Reflux.createStore({
<<<<<<< HEAD
	listenables: studentAction,
	init: function(){

=======
	listenables: studentActions,

  // Initialize the store
	init: function(){
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
    var that = this;

    request.get(URL + 'students').end(function(err,res){
      if (err) {
        console.error("Error initializing the studentStore: ", error);
      }

<<<<<<< HEAD
      if(res.body && res.body.length && res.body.length > 0) {
        students = res.body;
      }

=======
      if (res.body && res.body.length && res.body.length > 0) {
        students = res.body;
      }
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
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
<<<<<<< HEAD
=======

>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
    var newStudent = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
<<<<<<< HEAD
      rank: data.rankId,
      healthInformation: data.healthinformation,
      guardianInformation: data.guardianinformation,
      email: data.emails,
      membershipExpiry: new Date(),
      phone: data.phone,
      birthDate: data.bday
    };

    request
      .post(URL + 'students')
      .send(newStudent)
      .end(function(err, res){
        if(err){
          console.error("Error adding a student: ", err);
          return that.trigger(students);
        }

        students.push(newStudent);
        that.trigger(students);
=======
      rankId: parseInt(data.rankId, 10),
      healthInformation: data.healthInformation,
      guardianInformation: data.guardianInformation,
      email: data.email,
      membershipExpiry: new Date(),
      phone: data.phone,
      birthDate: data.birthDate
    };

    request
      .post(URL + 'student')
      .send(newStudent)
      .end(function(err, res){
        if(err){
          return addStudent.failed(err);
        }

        students.push(newStudent);
        addStudent.completed(students);
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
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

<<<<<<< HEAD
	editStudent: function(updatedInfo){
    var that = this;

    var student;
    var index;
=======
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
    for(var i = 0; i < students.length; i++){
      if(students[i]._id == updatedInfo._id) {
        student = students[i];
        index = i;
        break;
      }
    }

    if(!student) {
<<<<<<< HEAD
      console.error("Cannot update non-existant student");
      return this.trigger(students);
=======
      return editStudent.failed(students);
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
    }

    request
      .put(URL + "student/" + updatedInfo._id)
      .send(updatedInfo)
      .end(function(err, res) {
  			if(err){
<<<<<<< HEAD
          console.error("Error editing a student: ", err);
          return that.trigger(students);
        }

        students[index] = updatedInfo;
        that.trigger(students);
=======
          return editStudent.failed(err);
        }

        students[index] = updatedInfo;
        editStudent.completed(students);
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
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
<<<<<<< HEAD

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
      console.error("Cannot delete non-existant student");
      this.trigger(students);
    }

    request
      .del(URL + "student/" + id)
      .end(function(err, res){
        if (err) {
          console.error("Error deleting a student: ", err);
          return that.trigger(students);
        }

        // A delete returns 204 no matter what,
        // so we attempt a get request on the student
        // to confirm it was deleted
        request
          .get(URL + "student/" + id)
          .end(function(err, res) {
            if (!err || res.message != "Invalid data!") {
              console.error("Error deleting a student: ", err);
              return that.trigger(students);
            }

            students.splice(index, 1);
		        that.trigger(students);
          });
      });
	},

	getInitialState: function() {
		return students;
	},

  componentWillUpdate: function(){
    this.trigger(students);
  }
});

module.exports = studentStore;

=======

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

>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
