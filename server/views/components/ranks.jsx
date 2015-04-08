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


var Ranks = module.exports = React.createClass({
  
  render: function(){
    var addButton= (
      <ButtonToolbar>
        <Link to="addRank"><Button>+</Button></Link>
      </ButtonToolbar>
    );
    var toolbar =(
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={8}><h4 className="pull-right">RANK MANAGEMENT TOOLBAR</h4></Col>
          <Col xs={4} md={4}><span className="pull-right">{addButton}</span></Col>
        </Row>
      </Grid>
    );
    return(
      <div className="ranks">
        {toolbar}
        <RouteHandler routerParams={this.props.routerParams} />
      </div>
    );
  }
});
