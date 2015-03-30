var request = require('superagent');

var url = 'http://localhost:8745/';

var students = [];

var opendojo = module.exports = {
  studentModel: {
    init : function(cb){
      request.get(url+'api/students').end(function(err,res){
        if(err){
          console.log(err);
        }
        students = res.body;
        if(!students){
        console.log("Student database doesn't exist");
        return;
      }
      else{
        cb(null, students);
      }
    });

    },
    addStudent : function(data,cb){
      request
        .post(url+'api/students')
        .send({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          //Need to fix
          rankId: "N/A",
          healthInformation: data.healthiInfo,
          guardianInformation: data.guardianInfo,
          email: data.email,
          membershipExpiry: new Date(),
          phone: data.phone,
          birthDate: data.birthDate
        })
        .end(function(res){});
      cb(null,students);
    },
    updateStudent : function(data,cb){
      if(!students){
        console.log("Student database doesn't exist");
        return;
      }
      for(var i = 0; i<students.length;i++){
        if(students[i]._id == data._id){
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
      request
        .del(url+"api/student/"+id)
        .end(function(err,res){
          students = res.body;
        });
      cb(null,students);
    }
  }
};
