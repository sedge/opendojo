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
      query: this.refs.searchInput.getValue().toLowerCase()
    });
  },

  render: function(){
    var addButton= (
      <ButtonToolbar>
        <Link to="addStudent"><Button bsSize='large'>+</Button></Link>
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
        <RouteHandler routerParams={this.props.routerParams} query={this.state.query} />
      </div>
    );
  }
});
