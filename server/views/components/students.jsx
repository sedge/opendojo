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
	Col
} = require('react-bootstrap');
var SearchBox = React.createClass({
    doSearch:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.doSearch(query);
    },
    render:function(){
        return <input type="text" ref="searchInput" placeholder="Search Name" value={this.props.query} onChange={this.doSearch}/>
    }
});

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
          			<Col xs={6} md={4}><SearchBox query={studentList.state.query} doSearch={this.doSearch}/></Col>
          			<Col xs={6} md={4}><h4 className="text-center">STUDENT MANAGEMENT TOOLBAR</h4></Col>
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
