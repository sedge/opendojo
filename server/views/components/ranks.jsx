/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var Reflux = require('reflux');
var {
  RouteHandler,
  Link,
  Navigation
} = require('react-router');
var {
  Button,
  Glyphicon,
  Grid,
  ButtonToolbar,
  Row,
  Col
} = require('react-bootstrap');

var TerminalCheck = require('../mixins/terminalCheck.jsx')

var Ranks = module.exports = React.createClass({
  mixins: [Navigation, TerminalCheck],
  render: function(){
    // Force a blank render to make the transition prettier
    if (this.props.terminalMode) {
      return (<div/>);
    }

    var addButton= (
      <ButtonToolbar>
        <Link to="addRank"><Button bsSize='large'><Glyphicon glyph='plus' /></Button></Link>
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
