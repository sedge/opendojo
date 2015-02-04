var mongoose = require('mongoose');

//Variables for the schemas
var Schema; 
var rankSchema;
var Rank; 
var studentSchema; 
var Student;
var classSchema;
var Class;
var attendanceSchema;
var Attendance;
var db;

	/*Mongo sends the complete document as a callbackobject so you can simply get it from there only.
    for example n.save(function(err,room){
  var newRoomId = room._id;
  }); http://stackoverflow.com/questions/6854431/how-do-i-get-the-objectid-after-i-save-an-object-in-mongoose*/
 

//data=Student object, callback: function (err, StudentObject)
function createStudent(data, callback)
{
 //if Student exists then add it to db
  if (!data) throw "No data passed to the createStudent call";
   var newStudent = new Student(data);
   newStudent.save(function (err, newStudent){
    if (err) return console.error(err);
    callback(null, newStudent);
    return;
   });
}

//callback: function(err, users)
function GetAllStudents( callback)
{
	Student.find({}, callback);
}

//Will have to pass Student.ID, updated Student as Object function (err, StudentObject)
function UpdateStudent (id, updatedStudent, callback)
{
	//from Mongoose: A.findByIdAndUpdate(id, update, callback) // executes
	Student.findByIdAndUpdate(id, updatedStudent, callback);
}

/*frm mongoose --> find adventure by id and execute immediately
Adventure.findById(id, function (err, adventure) {});*/
//Call getStudentsById(Student.ID, function (err, StudentObject))
function getStudentById(id, callback)
{	
	Student.findById(id, callback);
}

/*from mongoose --> // executes immediately, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
*///am assuming it wants an empty student object
//getStudentsByName(student first name, student last name, function (err, student))
function getStudentByName(stFName, stLName, callback)
{
	Student.find({FirstName: stFName, LastName: stLName}, callback);
}
/*from mongoose --> // executes immediately, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
*///am assuming it wants an empty array of students
//getStudentsByGender(student gender, function (err, students))
function getStudentsByGender(stGender, callback)
{
	Student.find({Gender: stGender}, callback);
}

/*from mongoose --> // executes immediately, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
*///am assuming it wants an empty array of students
//the ranks would have to be searched by color?  And the id of an appropriate rank
//would have to be pulled to pas sto this fcn
//getStudentsByRank(student rank, function (err, student))
function getStudentsByRank(stRank, callback)
{
	Student.find({RankId: stRank}, callback);
}
/*from mongoose --> // executes immediately, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
*///am assuming it wants an empty array of students
//getStudentsByStatus(student status, function (err, students))
function getStudentsByStatus(stStatus, callback)
{
	Student.find({membershipStatus: stStatus}, callback);
}


module.exports= function(env){//Create connection

	db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function (callback) {
		 //Presumably connected
		 Schema = mongoose.Schema;
		
		//Rank entity
		rankSchema = new Schema({
			name: String,
			sequence: Number,
			color: String
		});

		Rank = mongoose.model('Rank', rankSchema);

		//Student entity
		studentSchema = new Schema({
			FirstName :String,
			LastName :String,
			Gender:String,
			RankId : {type: mongoose.Schema.Types.ObjectId, ref: ‘Rank’},
			HealthInformation:String,
			GuardianInformation:String, 
			Email: {type: [String]}, 
			membershipStatus: Boolean,
			membershipExpiry:Date,
			phone:String,
			BirthDate:Date
		}); 

		Student = mongoose.model('Student', studentSchema);

	    //Class entity
		classSchema = new Schema({
			class_title: String,
			start_date : Date,
			end_date: Date,
			day_of_week: Number,
			start_time: Date,
			end_time: Date,
			classType: String, 
			RanksAllowed: {type: [Schema.ObjectId], ref:'Rank'}
		});

		Class= mongoose.model('Class', classSchema);

		//Attendance entity
		attendanceSchema = new Schema({
			student_id: {type: mongoose.Schema.Types.ObjectId, ref:'Student'},
	    	classDate: Date,
	    	classTime: Date,
	    	classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
		});

	    Attendance= mongoose.model('Attendance', attendanceSchema);


	});//Populate with a couple of entities

	mongoose.connect(env.get("DBHOST"));
    
    return{
		createStudent: createStudent,
		GetAllStudents: GetAllStudents,
		UpdateStudent: UpdateStudent,
		getStudentById: getStudentById,
		getStudentByName: getStudentByName,
		getStudentsByGender: getStudentsByGender,
		getStudentsByRank: getStudentsByRank,
		getStudentsByStatus: getStudentsByStatus
	}

}
//methods that I need
/*Student
createStudent() done
updateStudent() done
getAllStudents() done
getStudentById(id) done
getStudentByName(name) done
getStudentsByRank(rank) done
getStudentsByGender(gender) done
getStudentsByStatus(status) done
addClass()
updateClass()
getAllClasses()
getClassById(id)
getClassByName(name)
getClassesByDate(date)
createAttendanceRecord()
getAttendingStudentsByName(name)
getAttendingStudentsByRank(rank)
getAttendingStudentsByGender(gender)
getAttendingStudentsByDate(date)
getAttendingStudentsByClass(class)*/