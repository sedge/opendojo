var React = require('react');
var Reflux = require('reflux');
var {
	RouteHandler,
	Link
} = require('react-router');
var {
	Button,
	Grid,
	ButtonToolbar,
	Row,
	Col,
	Input,
    Panel
} = require('react-bootstrap');


var Students = module.exports = React.createClass({
	getInitialState: function(){
    return {
      query:'',
    };
  },
	doSearch:function(){
    this.setState({
      query: this.refs.searchInput.getValue()
    });
  },
	render: function(){
		var addButton= (
			<ButtonToolbar>
				<Link to="addStudent"><Button>+</Button></Link>
			</ButtonToolbar>
		);
		var toolbar =(
			<Grid>
				<Row className="show-grid">
    			<Col xs={6} md={4}><Input type="text" ref="searchInput" onChange={this.doSearch} placeholder="Search by name..."/></Col>
    			<Col xs={8} md={6}><Panel className="text-center"><strong>STUDENT MANAGEMENT TOOLBAR</strong></Panel></Col>
    			<Col xs={2} md={2}><span className="pull-right">{addButton}</span></Col>
   			</Row>
   		</Grid>
		);
		return(
			<div className="students">
				{toolbar}
				<RouteHandler routerParams={this.props.routerParams} query={this.state.query} />
			</div>
		);
	}
});
