var Reflux = require('reflux');
var request = require('superagent');

var studentAction = require('../actions/studentActions.jsx');

var { URL } = require('../bin/constants.jsx');

var id = 0;

var students = [];

var studentStore = Reflux.createStore({
	listenables: studentAction,
	init: function(){

    var that = this;

    request.get(URL + 'students').end(function(err,res){
      if (err) {
        console.error("Error initializing the studentStore: ", error);
      }

      if(res.body && res.body.length && res.body.length > 0) {
        students = res.body;
      }

      that.trigger(students);
    });
	},

	addStudent: function(data){
    var that = this;
    var newStudent = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
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
      });
	},

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
      console.error("Cannot update non-existant student");
      return this.trigger(students);
    }

    request
      .put(URL + "student/" + updatedInfo._id)
      .send(updatedInfo)
      .end(function(err, res) {
  			if(err){
          console.error("Error editing a student: ", err);
          return that.trigger(students);
        }

        students[index] = updatedInfo;
        that.trigger(students);
      });
	},

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

