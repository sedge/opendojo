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
  Link
} = require('react-router');
var {
  Button,
  Grid,
  Glyphicon,
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
  render: function() {
    var searchGlyph = <Glyphicon glyph='search' />;
    var toolbar =(
      <Grid>
        <Row className="show-grid">
          <Col md={5} id="attendance"><Input type="text" ref="searchInput" onChange={this.doSearch} addonBefore={searchGlyph} placeholder="Enter student or class name..."/></Col>
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
