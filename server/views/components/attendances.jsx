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
  Input
} = require('react-bootstrap');


var Attendances = module.exports = React.createClass({
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
    var toolbar =(
      <Grid>
        <Row className="show-grid">
          <Col md={5} id="attendance"><Input type="text" ref="searchInput" onChange={this.doSearch} placeholder="Search by student name or class title..."/></Col>
          <Col xs={10} md={7}><h4 className="text-center">ATTENDANCE MANAGEMENT TOOLBAR</h4></Col>
        </Row>
      </Grid>
    );
    return(
      <div className="attendances">
        {toolbar}
        <RouteHandler routerParams={this.props.routerParams} query={this.state.query} />
      </div>
    );
  }
});
