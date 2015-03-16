var React = require('react');
var Router = require('react-router');

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var Route = Router.Route;
//   var DefaultRoute = Router.DefaultRoute;
//   ...
var {
  Route,
  DefaultRoute,
  NotFoundRoute
} = Router;

var App = require('../components/app.jsx');

// Main views
var Welcome = require('../components/welcome.jsx');

// Student child views
var ListStudents = require('../components/studentList.jsx');
var ViewStudent = require('../components/studentView.jsx');
var AddStudent = require('../components/studentForm.jsx');

// This:
//   1. Sets up routing functionality
//   2. Lays out the structure of the app clearly
var routes = (
	// Main view, will always be rendered
	//  - `handler` responsible for all permanent UI.
	<Route name="app" path='/' handler={App}>
		<Route name="allStudents" path="/students/all" handler={ListStudents} />
		<Route name="addStudent" path="/students/new" handler={AddStudent} />
		<Route name="singleStudent" path="/students/:id" handler={ViewStudent} />

		<DefaultRoute handler={Welcome} />
	</Route>
);

module.exports = routes;
