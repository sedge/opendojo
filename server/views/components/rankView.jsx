var React = require('react');
var Promise = require('bluebird');

var { ListenerMixin } = require('reflux');
var {
  Navigation,
  Link
} = require('react-router');

//This is needed for the delete method
var studentStore = require('../stores/studentStore.jsx');
var rankStore = require('../stores/rankStore.jsx');
var rankActions = require('../actions/rankActions.jsx');

var {
  Alert,
  Table,
  Button,
  Col,
  Row,
  Grid
} = require('react-bootstrap');

var AlertDismissable = require('./AlertDismissable.jsx');

var RankName = require('./rankName.jsx');
var RankColor = require('./rankColor.jsx');

var RankView = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],
  getInitialState: function() {
    return {
      editable: false,
      valid: true,
      deleteMessage: "",
      availableRanks: [],
      ranks: []
    };
  },

  componentWillMount: function() {
    var that = this;

    // Listen for changes to rank model state, immediately showing the latest ranks
    // through the callback
    this.listenTo(rankStore, this.showRank, function(ranks) {
      that.showRank(ranks);
    });

    // Listen to students to see what ranks the students have so that a rank wouldn't
    // deleted if it's assigned to a student
    this.listenTo(studentStore, this.getStudentRanks, function(students){
      this.getStudentRanks(students);
    });

    // Reflux can probably do this for us automatically, especially if we
    // use promise objects
    this.listenTo(rankActions.deleteRank.completed, this.deleteRankComplete);
    this.listenTo(rankActions.deleteRank.failed, this.deleteRankFailed);
    this.listenTo(rankActions.editRank.completed, this.editRankComplete);
    this.listenTo(rankActions.editRank.failed, this.editRankFailed);
  },

  getStudentRanks: function(students) {
    var usedRanks = [];

    students.forEach(function(student){
      usedRanks.push(student.rankId);
    });
   /* students.map(function(student){
      usedRanks[student._id] = student.rankId;
    });
*/
    this.setState({
      //Used to determine which ranks are held by students and therefore can't be deleted
      availableRanks: usedRanks
    });
  },

  showRank: function(ranks) {
    var that = this;
    var id = that.props.routerParams.id;

    ranks.forEach(function(rank) {
      if (id == rank._id) {
        that.setState({
          rank: rank,
          ranks:ranks
        });
      }
    });
    var highestSequence = rankStore.getSequence()+1;
    for (var i=1; i<highestSequence; i++) {

      if (!that.presentInArray(rankSequence,i)){
        rankSequence.push(i);
      }
    }

    rankSequence.sort();

    this.setState({
      rankSequence:rankSequence
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

  editToggle: function(e){
    e.preventDefault();
    this.setState({
      editable : !this.state.editable
    });
  },
  // `EditRank` Action Handling
  onEditRank: function(e){
    if (e) { e.preventDefault(); }

    var that = this;
    var valid = true;
    var sequence = "";

    var keys = Object.keys(this.refs);
    keys.forEach(function(ref) {
      var child = that.refs[ref];
      var value = ref;
      if (!child.state.valid) {
          valid = false;
      }
    });

    if (!valid) {
      // Show alert
      this.setState({
        valid: false
      });
      return;
    }

    this.setState({
      valid: true
    });
    this.state.ranks.forEach(function (rank) {
      if (that.props.routerParams.id == rank._id) {
        sequence = rank.sequence;
      }
    });
    var newRank = {
      _id: this.props.routerParams.id,
      name: this.refs.name.getValue().trim(),
      sequence: sequence,
      color: this.refs.color.getValue().trim()
    };
    rankActions.editRank(newRank);
  },
  editRankFailed:function(err) {
    console.error("Editing a rank failed: ", err);
    this.setState({
      editable: false
    });
  },
  editRankComplete: function() {
     this.setState({
      editable: false
    });
  },
  // `DeleteRank` Action Handling
  onDeleteRank: function(e){
    var mayDelete=true;
    var rankIDBeingDeleted = this.props.routerParams.id;
    var availableRanks = this.state.availableRanks;
    availableRanks.forEach(function(rank){
      var placer= 0;
      if (rank == rankIDBeingDeleted) {
        mayDelete=false;
      }
    });
    if (mayDelete) {
     rankActions.deleteRank(rankIDBeingDeleted);
    } else {
      this.setState({
        deleteMessage: "Can not delete this rank as it is being used."
      });
    }
  },
  deleteRankComplete: function(ranks) {
    this.transitionTo("ranks");
  },
  deleteRankFailed: function(ranks) {
    this.transitionTo("ranks");
  },

  render: function() {
    var content;
    var rank = this.state.rank;
    var editable = this.state.editable;
    var message = this.state.deleteMessage;

    if (!rank) {
      return (
        <div className="rankView container">
          <Alert bsStyle="danger">
            The rank associated with <strong>ID {this.props.routerParams.id}</strong> does not exist.
          </Alert>
        </div>
      );
    }

    if(!editable){
      return (
        <div className="rankView container">
          <Table bordered={true} striped={true}>
            <tr>
              <th colSpan="4">Viewing: {
                rank.name
              }</th>
            </tr>
            <tr>
              <th>Rank Title:</th>
              <td colSpan="3">{rank.name}</td>
            </tr>
            <tr>
              <th>Rank Sequence:</th>
              <td colSpan="3">{rank.sequence}</td>
            </tr>
            <tr>
              <th>Rank Color:</th>
              <td colSpan="3">{rank.color}</td>
            </tr>
          </Table>
          <p colSpan="6" className="red"> {message} </p>
          <Grid>
            <Row className="show-grid">
              <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.editToggle}>Edit</Button>&nbsp;&nbsp;
                <Button bsSize="large" bsStyle='warning' onClick={this.onDeleteRank}>Delete</Button></Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}><span className="pull-right"><Link to="ranks">
                <Button bsSize="large" >Back</Button></Link></span></Col>
            </Row>
          </Grid>
        </div>
      );
    }

    return (
      <div className="rankView container">
        <form>
          <h2>Update rank information:</h2>

          <RankName label="Rank Name" ref="name" name="name" defaultValue={rank.name} />
          <RankColor label="Rank Color" ref="color" name="color" defaultValue={rank.color} />

          <AlertDismissable visable={!this.state.valid} />
          <Grid>
            <Row className="show-grid">
              <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.onEditRank}>Save</Button></Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}><span className="pull-right"><Button bsSize="large" onClick={this.editToggle}>Cancel</Button></span></Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
});