/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

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

// First level views
var Welcome = require('../components/welcome.jsx');
var Notify = require('../components/notify.jsx');
var Students = require('../components/students.jsx');
var Ranks = require('../components/ranks.jsx');
var Classes = require('../components/classes.jsx');
var Terminal = require('../components/terminal.jsx');

var TerminalSettings = require('../components/terminalSettings.jsx');
var Guide = require('../components/guide.jsx');

// Student child views
var ListStudents = require('../components/studentList.jsx');
var ViewStudent = require('../components/studentView.jsx');
var AddStudent = require('../components/studentForm.jsx');

// Rank child views
var ListRanks = require('../components/rankList.jsx');
var ViewRank = require('../components/rankView.jsx');
var AddRank = require('../components/rankForm.jsx');

// Class child views
var AddClass = require('../components/classForm.jsx');
var EditClass = require('../components/editClass.jsx');
var ListClasses = require('../components/classList.jsx');

// Attendance child views
var ListAttendance = require('../components/attendanceList.jsx');
var Attendances = require('../components/attendances.jsx');

// Terminal child views
var ClassCheckIn = require('../components/classCheckin.jsx');
var ClassPicker = require('../components/classPicker.jsx')

// This:
//   1. Sets up routing functionality
//   2. Lays out the structure of the app clearly
var routes = (
	// Main view, will always be rendered
	//  - `handler` responsible for all permanent UI.
	<Route name="app" path='/' handler={App}>
		<Route name="terminal" path='terminal' handler={Terminal}>
			<Route name="classPicker" handler={ClassPicker} />
			<Route name="checkIn" path=':classID/:studentID' handler={ClassCheckIn} />

			<DefaultRoute handler={ClassPicker} />
		</Route>

		<Route name='welcome' path='welcome' handler={Welcome} />
		<Route name='notify' path='notify' handler={Notify} />

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
		<Route name='attendances' path='attendances' handler={Attendances}>
			<DefaultRoute handler={ListAttendance} />
		</Route>
    <Route name='guide' path='guide' handler={Guide}>
       <DefaultRoute handler={Guide} />
    </Route>
		<Route name="terminalSettings" path='settings' handler={TerminalSettings} >
			<DefaultRoute handler={TerminalSettings} />
		</Route>

		<DefaultRoute handler={Welcome} />
		<NotFoundRoute handler={Welcome} />
	</Route>
);

module.exports = routes;
//NEED TO PUT THIS IN FOR THE CLASS CHECKIN ROOT AFTER KIERAN DOES HIS SCREEN
//<Route name="checkIn" path=':classID/:studentID' handler={ClassCheckIn}>
//
