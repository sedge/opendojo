var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var ReactBootstrap = require('react-bootstrap');
var {
	RouteHandler
} = Router;
var { Link } = require('react-router');
var {
	Button,
	Grid,
	ButtonToolbar,
	Row,
	Col
} = ReactBootstrap;


var Students = module.exports = React.createClass({
	
	render: function(){
		var addButton= (
			<ButtonToolbar>
				<Link to="addStudent"><Button>+</Button></Link>
			</ButtonToolbar>
		);
		var toolbar =(
			<Grid>
				<Row className="show-grid">
          			<Col xs={6} md={4}><input type="text" name="searchStudent" placeholder="Serach by Name..." /></Col>
          			<Col xs={6} md={4}><h4 className="text-center">STUDENT NAMAGEMENT TOOLBAR</h4></Col>
          			<Col xs={6} md={4}><span className="pull-right">{addButton}</span></Col>
       			</Row>
       		</Grid>
		);
		return(
			<div className="students">
				{toolbar}
				<RouteHandler routerParams={this.props.routerParams} />
			</div>
		);
	}
});