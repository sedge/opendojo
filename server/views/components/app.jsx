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
  RouteHandler,
  Navigation
} = Router;

var LoginUI = require('./login.jsx');

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
  DropdownButton,
  MenuItem,
  Alert
} = require('react-bootstrap');

// Note, each route is actually a name
// corresponding with the React-Router
// configuration in router.jsx
var dashboardNav = {
  "Students": "students",
  "Ranks": "ranks",
  "Classes": "classes",
  "Attendance": "attendances",
  "Send Notifications": "notify",
  "Switch to Terminal Mode": "welcome"
};

// Unique key for each link
var headerLinkId = 0;

var App = React.createClass({
  mixins: [Navigation, ListenerMixin],
  listenables: [authActions],

  componentWillMount: function() {
    var that = this;
    var tokenCheck;

    this.listenTo(logIn.completed, function(token, validUser) {
      if(localStorage.getItem("token")) {
        tokenCheck = true;
      }

      that.setState({
        loggedIn: tokenCheck,
        tokenCheck: tokenCheck,
        user: validUser
      });
    });

    this.listenTo(logIn.failed, function(err, code) {
      var logOut;
      var validCheck = true;
      var alertText = 'Authentication Failed!';

      localStorage.removeItem("welcomed");

      if(code == 205) {
        logOut = true;
      }
      if(err == 'Access token has expired' || code == 400) {
        validCheck = false;
        alertText = 'Your authentication window has expired! Please log in again:';
        localStorage.removeItem("token");
      }
      if(err || code == 401) {
        validCheck = false;
      }

      that.setState({
        tokenCheck: validCheck,
        loggedOut: logOut,
        loggedIn: false,
        alertText: alertText
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
      tokenCheck: true,
      user: ''
    };
  },

  handleGuide: function() {
    this.transitionTo('/#/guide');
  },

  handleLogout: function() {
    localStorage.removeItem("token");
    localStorage.removeItem("welcomed");

    logIn.failed(null, 205);
  },

  render: function() {
    var primaryLinksText = Object.keys(dashboardNav);
    var primaryLinks = primaryLinksText.map(function(primaryLinksText) {
      return (
        <NavItemLink to={dashboardNav[primaryLinksText]} key={headerLinkId++}>
          {primaryLinksText}
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
            brand = {<a href="/">OpenDojo</a>}
          />
          <Grid>
            <Alert bsStyle="info">
              Welcome! Please log in below to continue:
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

    // View for authentication failure at any point
    else if(this.state.tokenCheck == false) {
      view = (
        <div id = "main">
          <Navbar
            fixedTop = {true}
            brand = {<a href="/">OpenDojo</a>}
          />
          <Grid >
            <Alert bsStyle="danger">
              {this.state.alertText}
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
            brand = {<a href="/">OpenDojo</a>}
          >
            <Nav right = {true}>
              <NavItem disabled={true}><small>Hi, {this.state.user ? this.state.user : 'welcome back'}!</small></NavItem>
              <DropdownButton title='Extras'>
                <NavItemLink to="/guide">Usage Guide</NavItemLink>
              </DropdownButton>
              <NavItem onClick={this.handleLogout}><Button bsStyle="danger" bsSize="small">Log Out</Button></NavItem>
            </Nav>
          </Navbar>

          <Grid>
            {/* Main Content */}
            <Row>
              {/* Navbar */}
              <Col md = {3}>
                <div className = "sidebar-nav">
                  <Navbar>
                    <Nav>
                      {primaryLinks}
                    </Nav>
                  </Navbar>
                </div>
              </Col>
              { /* Child View */ }
              <Col md={9}>
                <RouteHandler routerParams={this.props.routerParams}/>
              </Col>
            </Row>
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

    return view;
  }
});

module.exports = App;
