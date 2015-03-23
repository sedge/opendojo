var students = {};

var opendojo = moduel.exports = {
  studentModel: {
    init : function(cb){
      if(err){
        console.log(err);
        cb(err)
        return;
      }
      if(!students){
        console.log("Student database doesn't exist");
        return;
      }
      else{
        this.students = students;
        cb(null, students);
      }
    },
    addStudent : function(data,cb){
      if(err){
        console.log(err);
        cb(err);
        return;
      }
      students.push(data);      
      cb(null,students);
    },
    updateStudent : function(data,cb){
      if(err){
        console.log(err);
        cb(err);
        return;
      }
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
      if(err){
        console.log(err);
        cb(err);
        return;
      }
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
}