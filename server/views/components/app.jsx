/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

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
  Navigation,
  Link
} = Router;

var LoginUI = require('./login.jsx');

var authActions = require('../actions/authActions.jsx');
var {
  logIn,
  validate
} = authActions;

var authStore = require('../stores/authStore.jsx');

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
  Glyphicon,
  Badge,
  DropdownButton,
  MenuItem,
  Alert
} = require('react-bootstrap');

// Note, each route is actually a name
// corresponding with the React-Router
// configuration in router.jsx
var dashboardNav = {
  "Summary": "welcome",
  "Students": "students",
  "Ranks": "ranks",
  "Classes": "classes",
  "Attendance": "attendances"
};

// Unique key for each link
var headerLinkId = 0;

var App = React.createClass({
  // Provides access to the router context object,
  // containing route-aware state (URL info etc.)
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [Navigation, ListenerMixin],
  listenables: [authActions],

  componentWillMount: function() {
    var that = this;
    var tokenCheck;

    this.listenTo(validate.completed, function(){
      localStorage.removeItem("terminalMode");
      this.setState({
        terminalMode: false
      });
    });
    this.listenTo(validate.failed, function(err){
      console.error("Validation failure... \n", err);
    });

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
        localStorage.removeItem("terminalMode");
      }
      if(err || code == 401) {
        validCheck = false;
      }

      that.setState({
        tokenCheck: validCheck,
        loggedOut: logOut,
        loggedIn: false,
        alertText: alertText,
        terminalMode: false
      });
    });
  },

  getInitialState: function() {
    var loggedIn = false;
    var loggedOut = false;
    var terminalMode = localStorage.getItem("terminalMode");

    // Add a /validate step
    if(localStorage.getItem("token")) {
      loggedIn = true;
    }

    return {
      loggedIn: loggedIn,
      loggedOut: loggedOut,
      tokenCheck: true,
      user: '',
      terminalMode: !!terminalMode
    };
  },

  handleGuide: function() {
    this.transitionTo('/#/guide');
  },

  handleLogout: function() {
    var confirmLogout = confirm("Do you really want to log out of OpenDojo?");
    if (confirmLogout){
      localStorage.removeItem("token");
      localStorage.removeItem("welcomed");
      localStorage.removeItem("terminalMode");

      this.setState({
        terminalMode: false
      });

      logIn.failed(null, 205);
    }
  },

  toggleTerminalMode: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    localStorage.setItem('terminalMode', true);
    this.setState({
      terminalMode: true
    });
    this.transitionTo("terminal");
  },

  render: function() {
    var that = this;
    var primaryLinksText = Object.keys(dashboardNav);
    var currentGlyph;
    var primaryLinks = primaryLinksText.map(function(primaryLinksText) {
      switch(primaryLinksText) {
        case "Summary":
          currentGlyph = 'globe';
          break;
        case "Students":
          currentGlyph = 'user';
          break;
        case "Ranks":
          currentGlyph = 'certificate';
          break;
        case "Classes":
          currentGlyph = 'education';
          break;
        default:
          currentGlyph = 'list-alt';
          break;
      }

      return (
        <NavItemLink to={dashboardNav[primaryLinksText]} key={headerLinkId++}>
          <Glyphicon glyph={currentGlyph} /> {primaryLinksText}
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
        <div id="main">
          <Navbar
            fixedTop = {true}
            brand = {<Link to="welcome">OpenDojo</Link>}
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
        <div id="main">
          <Navbar
            fixedTop = {true}
            brand = {<Link to="welcome">OpenDojo</Link>}
          />
          <Grid>
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

    // User has successfully logged in, and we're in
    // terminal mode
    else if (this.state.terminalMode == true) {
      view = (
       <div id="main">
         <Grid>
            <Row>
              <Col sm={12}>
                <RouteHandler handleLogout={this.handleLogout} terminalMode={this.state.terminalMode} routerParams={this.props.routerParams}/>
              </Col>
            </Row>
          </Grid>
       </div>
      );
    } else {
      view = (
        <div id="main">
          <Navbar
            fixedTop = {true}
            brand = {<Link to="welcome">OpenDojo</Link>}
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
                  <Badge>Data Modules</Badge>
                  <Navbar id="ModMenu">
                    <Nav>
                      {primaryLinks}
                    </Nav>
                  </Navbar>
                  <Badge>Services</Badge>
                  <Navbar id="ModMenu">
                    <Nav>
                      <NavItemLink to="notify" key={headerLinkId++}>
                        <Glyphicon glyph="envelope" /> Send Notifications
                      </NavItemLink>
                      <NavItem to="welcome" onClick={this.toggleTerminalMode} key={headerLinkId++}>
                        <Glyphicon glyph="phone" /> Mobile Terminal Mode
                      </NavItem>
                      <NavItemLink to="terminalSettings" key={headerLinkId++}>
                        <Glyphicon glyph="wrench" /> Configure Terminal
                      </NavItemLink>
                    </Nav>
                  </Navbar>
                </div>
              </Col>
              { /* Child View */ }
              <Col md={9}>
                <RouteHandler terminalMode={this.state.terminalMode} routerParams={this.props.routerParams}/>
              </Col>
            </Row>
            <div id="welcome">
              <span />
            </div>
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
