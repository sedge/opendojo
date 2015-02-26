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
