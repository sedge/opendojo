// This file is a simple temporary data store that
// initializes a few models and provides a bare
// minimum of methods to manipulate them. It does
// no validation.

var students = [];
var id = 0;

function UUID() {
	return ++id;
}

function addStudent(data) {
	data.id = UUID();

	students.push(data);
}

function getStudentById(id) {
	var student;

	students.forEach(function(s) {
		if (s.id == id) {
			student = s;
		}
	});

	return student;
}

function getAllStudents() {
	return students;
}

// We add some sample data
addStudent({
	firstName: "Kieran",
	lastName: "Sedgwick",
	rank: "Black-belt",
	emails: [
		'example1@myseneca.ca',
		'example2@myseneca.ca'
	]
});
addStudent({
	firstName: "Alina",
	lastName: "Shtramwasser",
	rank: "Kitty-belt",
	emails: [
		'example1@myseneca.ca'
	]
});
addStudent({
	firstName: "Yoav",
	lastName: "Gurevich",
	rank: "Smoke-belt",
	emails: [
		'example1@myseneca.ca',
		'example2@myseneca.ca'
	]
});
addStudent({
	firstName: "Chris",
	lastName: "Choi",
	rank: "?????",
	emails: [
		'example1@myseneca.ca',
		'example2@myseneca.ca'
	]
});

// We expose all of the methods
module.exports = {
	UUID: UUID,
	addStudent: addStudent,
	getStudentById: getStudentById,
	getAllStudents: getAllStudents
};