var React = require('react');
var Router = require('react-router');
var {
  ListenerMixin
} = require('reflux');

// EcmaScript6 destructuring assignment syntax.
// Equivalent to:
//   var RouteHandler = Router.RouteHandler;
//   ...
var {
  RouteHandler
} = Router;

var LoginUI = require('./login.jsx');
var Banner = require('./banner.jsx');

var authActions = require('../actions/authActions.jsx');
var {
  logIn
} = authActions;

var {
  NavItemLink
} = require('react-router-bootstrap');

var {
  Grid,
  Row,
  Col,
  Navbar,
  Nav,
  NavItem,
  Button,
  Alert
} = require('react-bootstrap');

// Note, each route is actually a name
// corresponding with the React-Router
// configuration in router.jsx
var nav = {
  "Students": "students",
  "Ranks": "welcome2",
  "Classes": "welcome3",
  "Attendance": "welcome4"
};

// Unique key for each link
var headerLinkId = 0;

var App = React.createClass({
  mixins: [ListenerMixin],
  listenables: [authActions],

  componentWillMount: function() {
    var that = this;
    var tokenCheck;

    this.listenTo(logIn.completed, function() {
      if(localStorage.getItem("token")){
        tokenCheck = true;
      }

      that.setState({
        loggedIn: tokenCheck,
        tokenCheck: tokenCheck
      });
    });

    this.listenTo(logIn.failed, function(err, code) {
      var logOut;
      var validCheck = true;

      if(code == 205) {
        logOut = true;
      }
      if(err || code == 401 || code == 400) {
        validCheck = false;
      }

      that.setState({
        tokenCheck: validCheck,
        loggedOut: logOut,
        loggedIn: false
      });
    });
  },

  getInitialState: function() {
    var loggedIn = false;
    var loggedOut = false;

    // Add a /validate step
    if(localStorage.getItem("token")) {
      loggedIn = true;
    }

    return {
      loggedIn: loggedIn,
      loggedOut: loggedOut,
      tokenCheck: true
    };
  },

  handleLogout: function() {
    localStorage.removeItem("token");
    logIn.failed(null, 205);
  },

  render: function() {
    var linkText = Object.keys(nav);
    var links = linkText.map(function(linkText) {
      return (
        <NavItemLink to = {nav[linkText]} key = {headerLinkId++}>
          {linkText}
        </NavItemLink>
      );
    });
    var view;

    /*
          User enters app for the very first time

     * - tokenCheck was set to be initially true in
     * order to enforce that there cannot possibly be
     * any authentication error
    */
    if (!this.state.loggedIn && this.state.tokenCheck) {
      view = (
        <div id = "main">
          <Navbar
            fixedTop = {true}
            brand = {"OpenDojo CMS"}
          />
          <Banner / >
          <Grid >
            <LoginUI / >
            {/* Footer */}
            <Row>
              <Navbar
                fixedBottom = {true}
                brand = {[<span>&copy;</span>, " 2015 Team Nariyuki & Seneca College"]}
              />
            </Row>
          </Grid>
        </div>
      );
    }

    // View for authentication failure at any point
    else if(this.state.tokenCheck == false) {
      view = (
        <div id = "main">
          <Navbar
            fixedTop = {true}
            brand = {"OpenDojo CMS"}
          />
          <Banner />
          <Grid >
            <Alert bsStyle="danger">
              Authentication failed!
            </Alert>
            <LoginUI />
            {/* Footer */}
            <Row>
              <Navbar
                fixedBottom = {true}
                brand = {[<span>&copy;</span>, " 2015 Team Nariyuki & Seneca College"]}
              />
            </Row>
          </Grid>
        </div>
      );
    }

    // User has successfully logged in
    else {
      view = (
        <div id = "main">
          <Navbar
            fixedTop = {true}
            brand = {"OpenDojo CMS"}
          >
            <Nav right = {true}>
              <NavItem onClick={this.handleLogout}>Log Out</NavItem>
            </Nav>
          </Navbar>
          <Banner />
          <Grid>
            {/* Main Content */}
            <Row>
              {/* Navbar */}
              <Col md = {3}>
                <div className = "sidebar-nav">
                  <Navbar>
                    <Nav>
                      {links}
                    </Nav>
                  </Navbar>
                </div>
              </Col>
              {/* Child View */}
              <Col md = {9}>
                <RouteHandler routerParams={this.props.routerParams} />
              </Col>
            </Row>
            {/* Footer */}
            <Row>
              <Navbar
                fixedBottom = {true}
                brand = {[< span >&copy;< /span>, " 2015 Team Nariyuki & Seneca College"]}
              />
            </Row>
          </Grid>
        </div>
      );
    }

    return view;
  }
});

module.exports = App;
