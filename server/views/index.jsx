/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

// Because this is the entry point, we expose React on the
// global namespace to enable Reactjs dev tools.
var React = require('react');
window.React = React;

var Router = require('react-router');

// This is responsible for rendering the application
// based off of which route has been hit.
var routeConfiguration = require('./bin/routes.jsx');
Router.run(routeConfiguration, function(View, routerState) {
	var routerParams = routerState.params;

	// This is where react is triggered to build the react components and
	// the DOM.
	React.render(<View routerParams={routerParams}/>, document.getElementById("main"));
});
