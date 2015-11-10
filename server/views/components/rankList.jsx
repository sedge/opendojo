/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var { ListenerMixin } = require('reflux');

var rankActions = require('../actions/rankActions.jsx');
var rankStore = require('../stores/rankStore.jsx');
var RankSequence = require('./rankSequence.jsx');

var {
 Link,
 Navigation
} = require('react-router');

var {
  Alert,
  Table,
  ButtonToolbar,
  Button,
  Glyphicon
} = require('react-bootstrap');

var {
  sortByKey
} = require('../bin/utils.jsx');

var RankList = module.exports = React.createClass({
  mixins: [ListenerMixin, Navigation],
  getInitialState: function(){
    return {
      rankSequences: null,
      valid: true,
      editing: false,
      ranks: null
    };
  },
  componentWillMount: function() {
   var that = this;

    //Initial ranks are returned on line 38 of rankStore in getInitialState
    this.listenTo(rankStore, this.ranksUpdate, function(initialRanks) {
      that.ranksUpdate(initialRanks);
    });

    //Listening for edit rank responses with respect to sequences
    this.listenTo(rankActions.editSequence.completed, this.editRankComplete, function(newRanks){
      that.editRankComplete(newRanks);
    });
    this.listenTo(rankActions.editSequence.failed, this.editRankFailed);
  },
  ranksUpdate: function(latestRanks) {
    var that = this;
    var sortedArray;
    var rankSequences = [];
    var highestSequence = rankStore.getSequence();
    latestRanks.forEach(function(rank){
      for (var j=1; j<highestSequence; j++) {
        if (!that.presentInArray(rankSequences,j)){
          rankSequences.push(j);
        }
      }
    });
    rankSequences = rankSequences.sort();
    sortedArray = latestRanks.sort(sortByKey("sequence",0));
    this.setState({
      rankSequences:rankSequences,
      ranks: sortedArray
    });
  },
  presentInArray: function(array, searchElement) {
    for (var j=0; j<array.length; j++) {
      if (searchElement == array[j]) {
        var whatever = 0;
        return true;
      }
    }
  },
  editSequence: function (e) {
    this.setState({
      editing:true
    });
  },
  saveSequences: function (e) {
    var keys = Object.keys(this.refs);
    var that = this;
    var repeat = false;
    var editing = true;
    var chosenRanks = [];
    if (e) { e.preventDefault(); }

    keys.forEach(function(ref) {
      var child = that.refs[ref];
      var id = child.props.name;
      var parsedSequence = parseInt(child.getValue().trim());
      if (!that.presentInArray(chosenRanks, parsedSequence)){
        chosenRanks.push(parsedSequence);
      } else {
        repeat = true;
      }
    });

    if (!repeat) {
      keys.forEach(function(ref) {
        var title="";
        var color="";
        var child = that.refs[ref];
        var id = child.props.name;
        var parsedSequence = parseInt(child.getValue().trim());
        var newRank = {
          _id: id,
          sequence: parsedSequence
        }
        rankActions.editSequence(newRank);
      });
    }
    this.setState({
      valid: !repeat
    });
  },
  editRankFailed:function(err) {
    console.error("Editing a rank failed: ", err);
     this.setState({
      editing: true
    });
  },
  editRankComplete: function() {
    this.setState({
      editing: false
    });
  },
  editToggle: function(e){
    e.preventDefault();
    this.setState({
      editing : !this.state.editing
    });
  },
  render: function() {
    var that = this;
    var content;
    var ranks = this.state.ranks;
    var view;
    var feedBackString="";
    if (!this.state.valid) {
      feedBackString="The sequences must be unique";
    }

    if (!ranks) {
      view = (
        <Alert bsStyle="danger">
          There are no ranks in the database!
        </Alert>
      );
    } else {
      var rankRows;
      var key = 0;

      rankRows = ranks.map(function(rank) {
        var sequenceInput;
       

        if (that.state.editing){
          sequenceInput = (
            <td>
              <RankSequence ref={rank.name} name={rank._id} defaultValue={rank.sequence} sequences={that.state.rankSequences} />
            </td>
          );
        }else{
           sequenceInput = (
            <td>{rank.sequence}</td>
          );
        }

        return (
          <tr key={key++}>
            <td>{rank.name}</td>
            {sequenceInput}
            <td>{rank.color}</td>
            <td>
              <ButtonToolbar>
                <Link to="singleRank" params={{
                  id: rank._id
                }}><Button disabled={that.state.editing} bsSize="small">View</Button></Link>
              </ButtonToolbar>
            </td>
          </tr>
        );
      });

      view = (
        <Table>
          <thead>
            <th>Rank Title</th>
            <th>Rank Sequence&nbsp; 
            <Button bsSize="small" onClick={this.editSequence}>
               Edit
            </Button>
            &nbsp;
            <Button bsSize="small" disabled={!this.state.editing} onClick={this.saveSequences}>
              Save
            </Button>
            &nbsp;
            <Button bsSize="small" disabled={!this.state.editing} onClick={this.editToggle}>Cancel</Button>
            </th>
            <th>Rank Color</th>
            <th></th>
          </thead>
          <tbody>
            {rankRows}
          </tbody>
        </Table>
      );
    }

    return (
      <div className="rankView container">
        <form>
          {view}
          <p className="red"><strong>{feedBackString}</strong></p>
        </form>
      </div>
    );
  }
});

module.exports = RankList;
