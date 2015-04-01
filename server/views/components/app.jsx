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
var {
    logIn
    } = require('../actions/authActions.jsx');

var {
    Grid,
    Row,
    Col,

    Navbar,
    Nav
    } = require('react-bootstrap');

var {
    NavItemLink
    } = require('react-router-bootstrap');

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

    componentWillMount: function() {
        var that = this;

        this.listenTo(logIn, function() {
            that.setState({
                loggedIn: true
            });
        });
    },

    getInitialState: function() {
        return {
            token: localStorage["token"],
            loggedIn: false
        };
    },

    render: function() {
        var linkText = Object.keys(nav);
        var links = linkText.map(function(linkText) {
            return ( < NavItemLink to = {
                nav[linkText]
            }
            key = {
                headerLinkId++
            } >
            {
                linkText
            } < /NavItemLink>
            );
        });
        var view;

        if (!this.state.loggedIn) {
            view = ( < div id = "main" >
            < Navbar fixedTop = {
                true
            }
            brand = {
                "OpenDojo CMS"
            }
            /> < Banner / >
            < Grid >
            < LoginUI / >
            { /* Footer */ } < Row >
            < Navbar fixedBottom = {
                true
            }
            brand = {
                [< span >&copy;< /span>, " 2015 Team Nariyuki & Seneca College"]} / >
            < /Row> < /Grid> < /div>
        );
        }
        else {
            view = ( < div id = "main" >
            < Navbar fixedTop = {
                true
            }
            brand = {
                "OpenDojo CMS"
            }
            /> < Banner / >
            < Grid >
            { /* Main Content */ } < Row >
            { /* Navbar */ } < Col md = {
                3
            } >
            < div className = "sidebar-nav" >
            < Navbar >
            < Nav >
            {
                links
            } < /Nav> < /Navbar> < /div> < /Col>
            { /* Child View */ } < Col md = {
                9
            } >
            < RouteHandler routerParams = {
                this.props.routerParams
        }
        /> < /Col> < /Row>
        { /* Footer */ } < Row >
        < Navbar fixedBottom = {
            true
        }
        brand = {
            [< span >&copy;< /span>, " 2015 Team Nariyuki & Seneca College"]} / >
        < /Row> < /Grid> < /div>
        );
    }

    return view;
}

});

module.exports = App;
