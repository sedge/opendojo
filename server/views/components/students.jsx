var React = require('react');
var Reflux = require('reflux');
var { ListenerMixin } = Reflux;
var {
	RouteHandler,
	Link,
  Navigation
} = require('react-router');
var {
	Button,
	Grid,
	ButtonToolbar,
	Row,
	Col,
  Input
} = require('react-bootstrap');
var studentActions = require('../actions/studentActions.jsx');
var studentStore = require('../stores/studentStore.jsx');


var Students = module.exports = React.createClass({
<<<<<<< HEAD
  mixins: [ListenerMixin, Navigation],
  getInitialState: function(){
    return {
      students: null,
      query:'',
    };
  },
  componentWillMount: function() {
    this.listenTo(studentStore, this.studentsUpdate, function(initialStudents) {
      this.setState({
        students: initialStudents
      });
    });
  },
  studentsUpdate: function(latestStudents) {
    this.setState({
      students: latestStudents
    });
  },
	doSearch:function(){
    this.setState({
      query: this.refs.searchInput.getValue()
    });
  },
=======
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
	render: function(){
		var addButton= (
			<ButtonToolbar>
				<Link to="addStudent"><Button>+</Button></Link>
			</ButtonToolbar>
		);
		var toolbar =(
			<Grid>
				<Row className="show-grid">
          			<Col xs={6} md={4}><Input type="text" ref="searchInput" onChange={this.doSearch} placeholder="Search Name"/></Col>
          			<Col xs={6} md={4}><h4 className="text-center">STUDENT MANAGEMENT TOOLBAR</h4></Col>
          			<Col xs={6} md={4}><span className="pull-right">{addButton}</span></Col>
       			</Row>
       		</Grid>
		);
		return(
			<div className="students">
				{toolbar}
				<RouteHandler routerParams={this.props.routerParams} query={this.state.query} students={this.state.students} />
			</div>
		);
	}
});
