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
	<Route name='app' path='/' handler={App}>
		<Route name='welcome1' path='welcome1' handler={Welcome} />
		<Route name='welcome2' path='welcome2' handler={Welcome} />
		<Route name='welcome3' path='welcome3' handler={Welcome} />
		<Route name='welcome4' path='welcome4' handler={Welcome} />

		<DefaultRoute handler={Welcome} />
		<NotFoundRoute handler={Welcome} />
	</Route>
);

module.exports = routes;
