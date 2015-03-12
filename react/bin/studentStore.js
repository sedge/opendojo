var Reflux = require('reflux');
var studentAction = require('./studentActions.js');

var students = [];
var id = 0;

function UUID() {
	return ++id;
}

var studentStore = Reflux.createStore({
	listenables: studentAction,
	init: function(){},

	addStudent: function(data){
		data.id = UUID();

		students.push(data);
	},

	editStudent: function(id){

	},

	deleteStudent: function(id){
		for(var i = 0; i<students.length;i++){
			if(students[i].id == id){
				students.splice(i,1);
				break;
			}
		}
	},

	getAllStudent: function(){
		return students;
	},

	getStudentById: function(id){
		var student;

		students.forEach(function(s) {
			if (s.id == id) {
				student = s;
			}
		});

		return student;
	}
});



module.exports = {
	UUID: UUID,
	addStudent: studentStore.addStudent,
	editStudent: studentStore.editStudent,
	deleteStudent: studentStore.deleteStudent,
	getAllStudent: studentStore.getAllStudent,
	getStudentById: studentStore.getStudentById
};