var request = require('superagent');

var url = 'http://localhost:8745/api/';

var students = [];

var opendojo = module.exports = {
  studentModel: {
    init : function(cb){
      request.get(url+'students').end(function(err,res){
        if(err) return cb(err);

        if(req.body && req.body.length && req.body.length > 0) {
          students = req.body;
        }

        cb(null, students);
      });
    },
    addStudent : function(data, cb){
      var newStudent = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        rankId: data.rankId,
        healthInformation: data.healthiInfo,
        guardianInformation: data.guardianInfo,
        email: data.email,
        membershipExpiry: new Date(),
        phone: data.phone,
        birthDate: data.birthDate
      };

      request
        .post(url+'student')
        .send(newStudent)
        .end(function(err, res){
          if(err) return cb(err, students);

          students.push(newStudent);

          cb(null, students);
        });
    },
    updateStudent : function(updatedInfo, cb){
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
        return cb("Cannot update non-existant student", students);
      }

      request
        .put(url + "student/" + updatedInfo._id)
        .send(updatedInfo)
        .end(function(err, res) {
          if (err) return cb(err, students);

          students[index] = updatedInfo;

          cb(null, students);
        });
    },
    deleteStudent : function(id, cb){
      var student;
      var index;

      for(var i = 0; i < students.length; i++){
        if(students[i]._id == updatedInfo._id) {
          student = students[i];
          index = i;
          break;
        }
      }

      if (!student) {
        return cb("Cannot delete non-existant student", students);
      }

      request
        .del(url+"student/"+id)
        .end(function(err, res){
          if (err) return cb(err, students);

          // A delete returns 204 no matter what,
          // so we attempt a get request on the student
          // to confirm it was deleted
          request
            .get(url + "student/" + id)
            .end(function(err, res) {
              if (!err || res.message != "Invalid data!") {
                return cb("Delete failed!", students);
              }

              students.splice(index, 1);

              cb(null, students);
            });
        });
    }
  }
};
