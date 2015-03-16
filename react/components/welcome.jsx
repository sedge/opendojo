var React = require('react');

var { Jumbotron } = require('react-bootstrap');

var Welcome = module.exports = React.createClass({
	render: function() {
		return (
			<div className="Welcome container">
				<h2>Welcome to the application!</h2>
			</div>
		);
	}
});
