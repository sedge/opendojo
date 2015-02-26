var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var ReactRouterBootstrap = require("react-router-bootstrap");

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var Navbar = ReactBootstrap.Navbar;
//   ...
var {
	Navbar,
	Nav,
	DropdownButton,
	MenuItem
} = ReactBootstrap;

var {
	NavItemLink
} = ReactRouterBootstrap;

var LinkBar = module.exports = React.createClass({
	render: function() {
		var classes = {
			brand: this.props.title,
			fixedTop: this.props.fixedTop,
			fixedBottom: this.props.fixedBottom,
			fluid: true
		};

		return (
			<div className="container">
				{/* The `...` is the EcmaScript6 spread operator                      */}
				{/* and is the equivilent to:                                         */}
				{/* <Navbar brand={classes.brand} fixedTop={classes.fixedTop} etc. /> */}
				<Navbar {...classes}>
					<Nav>
						{this.props.children}
					</Nav>
				</Navbar>
			</div>
		);
	}
});

LinkBar.Link = React.createClass({
	render: function() {
		return (
			<NavItemLink to={this.props.name}>
				{this.props.children}
			</NavItemLink>
		);
	}
});