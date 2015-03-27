var React = require('react');
var Router = require('react-router');

var {
	Jumbotron
} = require('react-bootstrap');

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var Link = Router.Link;
//   ...
var {
	RouteHandler
} = Router;

// Component requires
var LinkBar = require("./LinkBar.jsx");

// Note, each route is actually a name
// corresponding with the React-Router
// configuration in router.jsx
var nav = {
	"Add a Student": "addStudent",
	"View all Students": "allStudents"
};

// Unique key for each link
var headerLinkId = 0;

var App = React.createClass({
	render: function() {
		var headerLinksText = Object.keys(nav);
    var headerLinks = headerLinksText.map(function(linkText) {
    	return (
    		<LinkBar.Link name={nav[linkText]} key={headerLinkId++}>
    			{linkText}
    		</LinkBar.Link>
    	);
    });

		return (
			<div id="main">
				<LinkBar fixedTop={true} title={"OpenDojo"}>
					{headerLinks}
				</LinkBar>

				<Jumbotron>
					<h2>Hello world!</h2>
					<p>I'll say.</p>
				</Jumbotron>

				{/* This is where child views will be rendered */}
				<RouteHandler routerParams={this.props.routerParams} />

				<LinkBar fixedBottom={true} title={"Copyright OpenDojo 2015"}>
				</LinkBar>
			</div>
		);
	}
});

module.exports = App;

