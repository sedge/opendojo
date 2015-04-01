var React = require('react');
var { ListenerMixin } = require('reflux');
var { Navigation } = require('react-router');

var { addRank } = require('../actions/rankActions.jsx');

var rankStore = require('../stores/rankStore.jsx');

var RankName = require('./rankName.jsx');
var RankSequence = require('./rankSequence.jsx');
var RankColor = require('./rankColor.jsx');

var AlertDismissable = require('./alertDismissable.jsx');


var {
  Alert,
  Button
} = require('react-bootstrap');

var RankForm = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],

  getInitialState: function() {
    return {
      valid: true,
      emptyvalid: true
    };
  },

  componentWillMount: function() {
    var that = this;

    this.listenTo(addRank.completed, this.addRankComplete);
    this.listenTo(addRank.failed, this.addRankFailed);
  },

  handleSubmit: function(e) {
    if (e) { e.preventDefault(); }

    var that = this;
    var valid = true;

    var keys = Object.keys(this.refs);
    keys.forEach(function(ref) {
      var child = that.refs[ref];

      // Is it in a valid state?
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

    if (!this.refs.name.getValue().trim()||
        !this.refs.color.getValue().trim()
        ){
        console.log("empty");
        this.setState({
          emptyvalid:false
        })
    }else{ 
      var sequenceToAdd = rankStore.getSequence();
      addRank({
        name: this.refs.name.getValue().trim(),
        sequence: sequenceToAdd,
        color: this.refs.color.getValue().trim()
      });
    }
  },

  addRankComplete: function() {
    this.transitionTo('/ranks');
  },
  addRankFailed: function(err) {
    console.error('Adding a rank failed: ', err);
    this.transitionTo('/ranks');
  },

  render: function() {
    var emptyWarn;
    var submitButton;
    if (!this.state.emptyvalid) {
      emptyWarn = (
        <Alert bsStyle="danger" id="alert">
          <p><strong>Please fill all text boxes</strong></p>
        </Alert>
      )
    } 
    return (
      <div className="addRank container">
        <form>
         {emptyWarn}
          <h2> Enter new rank information:</h2>
          <RankName label="Rank Name" ref="name" name="name" placeholder="e.g. Black" />
          <RankColor label="Rank Color" ref="color" name="color" placeholder="e.g. Black" />

          <AlertDismissable visable={!this.state.valid} />

          <button onClick={this.handleSubmit}>Save</button>
        </form>
      </div>
    );
  }
});
