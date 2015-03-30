var Reflux = require('reflux');
var studentAction = require('../actions/studentActions.jsx');
var { studentModel } = require('../bin/opendojo.jsx');
var students = [];
var id = 0;


var studentStore = Reflux.createStore({
	listenables: studentAction,
  students: null,
	init: function(){
		studentModel.init(function(err,stu){
			students = stu;
      console.log(students);
		});
	},

	addStudent: function(data){
		studentModel.addStudent(data,function(err,stu){
			if(err){
        console.log(err);
        return;
      }
      students = stu;
		});
	},

	editStudent: function(data){
		studentModel.updateStudent(data,function(err,stu){
			if(err){
        console.log(err);
        return;
      }
      students = stu;
		});
	},

	deleteStudent: function(id){
		studentModel.deleteStudent(id,function(err,stu){
			if(err){
        console.log(err);
        return;
      }
      students = stu;
		});
	},

	getInitialState: function() {
		return students;
	},

  componentWillUpdate: function(){
    this.trigger(students);
  }
});

function bdayCalculator(bday){
  var birthDate = new Date(bday);
  var today = new Date();

  var years = (today.getFullYear() - birthDate.getFullYear());
  if (today.getMonth() < birthDate.getMonth() ||
        today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate()) {
        years--;
    }

  return years;
}

function membershipStatusCalculator(exDate){
  var status;
  var expireDate = new Date(exDate);
  var today = new Date();
  var restDays = Math.floor((expireDate.getTime()-today.getTime())/(24 * 60 * 60 * 1000));
  if(expireDate-today > 0){
    status = "Available (" + restDays +" days left)";
  }else {status = "Expired";}
  return status;
}

module.exports = {
  membershipStatusCalculator : membershipStatusCalculator,
	agecal: bdayCalculator,
	store: studentStore
};
