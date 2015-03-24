var Reflux = require('reflux');
var studentAction = require('../actions/studentActions.jsx');
var { studentModel } = require('../bin/opendojo.jsx');
var students = [];
var id = 0;

function UUID() {
	return ++id;
}


var studentStore = Reflux.createStore({
	listenables: studentAction,
	init: function(){
		studentModel.init(function(err,stu){
			students = stu;
		});
	},

	addStudent: function(data){
		data.id = UUID();
		studentModel.addStudent(data,function(err,stu){
			if(err){
        console.log(err);
        return;
      }
      students = stu;
		});

		this.trigger(students);
	},

	editStudent: function(data){
		studentModel.updateStudent(data,function(err,stu){
			if(err){
        console.log(err);
        return;
      }
      students = stu;
		});
		this.trigger(students);
	},

	deleteStudent: function(id){
		studentModel.deleteStudent(id,function(err,stu){
			if(err){
        console.log(err);
        return;
      }
      students = stu;
		});
		this.trigger(students);
	},

	getInitialState: function() {
		return students;
	}
});



module.exports = {
	UUID: UUID,
	store: studentStore
};