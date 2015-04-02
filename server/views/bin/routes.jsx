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
var Students = require('../components/students.jsx');

// Rank child views
var ListRanks = require('../components/rankList.jsx');
var ViewRank = require('../components/rankView.jsx');
var AddRank = require('../components/rankForm.jsx');
var Ranks = require('../components/ranks.jsx');

// Class child views
var Classes = require('../components/classes.jsx');
var AddClass = require('../components/classForm.jsx');
var EditClass = require('../components/editClass.jsx');
var ListClasses = require('../components/classList.jsx')

// This:
//   1. Sets up routing functionality
//   2. Lays out the structure of the app clearly
var routes = (
	// Main view, will always be rendered
	//  - `handler` responsible for all permanent UI.

	<Route name="app" path='/' handler={App}>
		<Route name="students" path="students" handler={Students}>
			<Route name="addStudent" path="new" handler={AddStudent} />
			<Route name="singleStudent" path=":id" handler={ViewStudent} />
			<DefaultRoute handler={ListStudents} />
		</Route>
		<Route name='ranks' path='ranks' handler={Ranks}>
			<Route name="addRank" path = "new" handler={AddRank}/>
			<Route name="singleRank" path=":id" handler={ViewRank} />
			<DefaultRoute handler={ListRanks} />
		</Route>
		<Route name='classes' path='classes' handler={Classes} >
			<Route name="addClass" path="new" handler={AddClass} />
			<Route name="editClass" path=":id" handler={EditClass} />
			<DefaultRoute handler={ListClasses} />
		</Route>
		<Route name='welcome4' path='welcome4' handler={Welcome} />

		<DefaultRoute handler={Welcome} />
		<NotFoundRoute handler={Welcome} />
	</Route>
);

module.exports = routes;
