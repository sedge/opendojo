var request = require('superagent');

var url = 'http://localhost:8745/';

var students = [];

var opendojo = module.exports = {
  studentModel: {
    init : function(cb){
      if(!students){
        console.log("Student database doesn't exist");
        return;
      }
      else{
        cb(null, students);
      }
    },
    addStudent : function(data,cb){
      students.push(data);      
      cb(null,students);
    },
    updateStudent : function(data,cb){
      if(!students){
        console.log("Student database doesn't exist");
        return;
      }
      for(var i = 0; i<students.length;i++){
        if(students[i].id == data.id){
          students[i] = data;
          break;
        }
      }
      cb(null,students);
    },
    deleteStudent : function(id,cb){
      if(!students){
        console.log("Student database doesn't exist");
        return;
      }
      for(var i = 0; i<students.length;i++){
       if(students[i].id == id){
          students.splice(i,1);
          break;
        }
      }
      cb(null,students);
    }
  }
};
