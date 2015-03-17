var React = require('react');
var Router = require('react-router');

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var RouteHandler = Router.RouteHandler;
//   ...
var {
	RouteHandler
} = Router;

var {
	Grid,
	Row,
	Col,

	Navbar
} = require('react-bootstrap');

var { NavItemLink } = require('react-router-bootstrap');

// Note, each route is actually a name
// corresponding with the React-Router
// configuration in router.jsx
var nav = {
  "Students": "welcome1",
  "Ranks": "welcome2",
  "Classes": "welcome3",
  "Attendance": "welcome4"
};

// Unique key for each link
var headerLinkId = 0;

var App = React.createClass({
	render: function() {
		var linkText = Object.keys(nav);
    var links = linkText.map(function(linkText) {
    	return (
    		<NavItemLink to={nav[linkText]} key={headerLinkId++}>
    			{linkText}
    		</NavItemLink>
    	);
    });

		return (
			<div id="main">
				<Navbar fixedTop={true} brand={"OpenDojo"} />

				<Grid>
					{/* Main Content */}
					<Row>
						{/* Navbar */}
						<Col md={3}>
							<div className="sidebar-nav">
	              <Navbar className="fluid">
	                {links}
	              </Navbar>
              </div>
						</Col>

						{/* Child View */}
						<Col md={9}>
							<RouteHandler routerParams={this.props.routerParams} />
						</Col>
					</Row>

					{/* Footer */}
					<Row>
            <Navbar brand="Copyright Team Nariyuki 2015" />
					</Row>
				</Grid>
			</div>
		);
	}
});

module.exports = App;

