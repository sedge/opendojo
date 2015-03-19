var Reflux = require('reflux');
var studentAction = require('../actions/studentActions.jsx');

var students = [];
var id = 0;

function UUID() {
	return ++id;
}

students.push({
	id: UUID(),
	firstName: "lah",
	lastName: "leehhh",
	phone:"647-123-1234",
	rank: "boooo",
	age: "20",
	emails: ["fasldkfjadsfl@flkdsjfasld.com"]
});

var studentStore = Reflux.createStore({
	listenables: studentAction,
	init: function(){},

	addStudent: function(data){
		data.id = UUID();
		students.push(data);

		this.trigger(students);
	},

	editStudent: function(data){
		for(var i = 0; i<students.length;i++){
			if(students[i].id == data.id){
				students[i] = data;
				break;
			}
		}
		this.trigger(students);
	},

	deleteStudent: function(id){
		for(var i = 0; i<students.length;i++){
			if(students[i].id == id){
				students.splice(i,1);
				break;
			}
		}
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