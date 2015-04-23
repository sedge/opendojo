var React = require('react');
var Reflux = require('reflux');
var {
  Navigation,
  RouteHandler,
  Link
} = require('react-router');
var {
	Button,
    Glyphicon,
	Grid,
	ButtonToolbar,
	Row,
	Col,
	Input,
    Panel
} = require('react-bootstrap');

var TerminalCheck = require('../mixins/terminalCheck.jsx')

var Students = module.exports = React.createClass({
  mixins: [Navigation, TerminalCheck],
  getInitialState: function(){
    return {
      query:'',
      mainView: true
    };
  },
  componentWillMount: function() {
    if(this.props.routerParams.id || window.location.hash == "#/students/new") {
      return this.setState({
        mainView: false
      });
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var isMainView = true;

    if(nextProps.routerParams.id) {
      isMainView = false;
    }

    return this.setState({
      mainView: isMainView
    });
  },
  doSearch:function(){
    this.setState({
      query: this.refs.searchInput.getValue().toLowerCase()
    });
  },

  render: function(){
    // Force a blank render to make the transition prettier
    if (this.props.terminalMode) {
      return (<div/>);
    }
    var isNewView = false;
    if(window.location.hash == "#/students/new") {
      isNewView = true;
    }
    var addButton= (
      <ButtonToolbar>
        <Link to="addStudent"><Button bsSize='large'><Glyphicon glyph='plus' /></Button></Link>
      </ButtonToolbar>
    );
    var searchBar;
    if(this.state.mainView && !isNewView) {
      var searchGlyph = <Glyphicon glyph='search' />;
      searchBar = (
         <Col xs={6} md={3}><Input type="text" ref="searchInput" onChange={this.doSearch} addonBefore={searchGlyph} placeholder="Enter name..."/></Col>
      );
    }
    var toolbar = (
      <Grid>
        <Row className="show-grid">
          {searchBar}
          <Col xs={8} md={this.state.mainView && !isNewView ? 8 : 11}><h4 className="text-center">STUDENT MANAGEMENT TOOLBAR</h4></Col>
          <Col xs={1} md={1}><span className="pull-right">{addButton}</span></Col>
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
