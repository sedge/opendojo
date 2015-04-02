var React = require('react');
var { ListenerMixin } = require('reflux');
var {
  Navigation,
  Link
} = require('react-router');
var { addRank } = require('../actions/rankActions.jsx');
var rankStore = require('../stores/rankStore.jsx');
var RankName = require('./rankName.jsx');
var RankSequence = require('./rankSequence.jsx');
var RankColor = require('./rankColor.jsx');
var AlertDismissable = require('./alertDismissable.jsx');
var {
  Alert,
  Button,
  Col,
  Row,
  Grid
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

          <h2> Enter new rank information:</h2>
          <RankName label="Rank Name" ref="name" name="name" placeholder="e.g. Black" />
          <RankColor label="Rank Color" ref="color" name="color" placeholder="e.g. Black" />

          <AlertDismissable visable={!this.state.valid} />
          {emptyWarn}
          <Grid>
            <Row className="show-grid">
             <Col xs={6} md={4}><Button bsSize="large" bsStyle='primary' onClick={this.handleSubmit}>Save</Button></Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}><span className="pull-right"><Link to="ranks"><Button bsSize="large" >Cancel</Button></Link></span></Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
});
