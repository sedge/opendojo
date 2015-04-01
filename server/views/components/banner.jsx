var React = require('react');
var {
    Jumbotron
    } = require('react-bootstrap');

var Banner = module.exports = React.createClass({
	render: function() {
		return (
			<div className="Banner container">
                <Jumbotron>
				    <h1>OpenDojo</h1>
                </Jumbotron>
			</div>
		);
	}
});
