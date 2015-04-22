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

var {
  Row,
  Col,
  Button
} = require('react-bootstrap');

var Terminal = React.createClass({
  mixins: [Navigation, ListenerMixin],

  componentWillMount: function() {
    if (!this.props.terminalMode) {
      return this.transitionTo('welcome');
    }
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <div id="terminal">
        <Row>
          <Button onClick={this.props.handleLogout} bsStyle="danger" bsSize="small">Log Out</Button>
        </Row>
        <Row>
          <Col sm={12}>
            <RouteHandler terminalMode={this.props.terminalMode} routerParams={this.props.routerParams} />
          </Col>
        </Row>
      </div>
    );
  }
});

module.exports = Terminal;
