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
	rank: "boooo",
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
		students[data.id] = data;

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