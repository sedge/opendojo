var React = require('react');
var { ListenerMixin } = require('reflux');
var { Navigation } = require('react-router');

var { addClass } = require('../actions/classActions.jsx');


var rankStore = require('../stores/rankStore.jsx');

var AlertDismissable = require('./alertDismissable.jsx');

var RankInput = require('./rankInput.jsx');

var {
  Alert,
  Button,
  Input,
  Row,
  Col
} = require('react-bootstrap');

var ClassForm = module.exports = React.createClass({
  mixins: [Navigation, ListenerMixin],

  getInitialState: function() {
    return {
      emptyvalid: true,
      valid: true
    };
  },

  componentWillMount: function() {
    var that = this;

    this.listenTo(addClass.completed, this.addClassComplete);
    this.listenTo(addClass.failed, this.addClassFailed);

    // Listen for changes to class model state, immediately grabbing the most recent ranks
    // through the callback
    this.listenTo(rankStore, this.updateRanks, function(ranks) {
      that.updateRanks(ranks);
    });
  },

  updateRanks: function(ranks) {
    var processedRanks = {};

    ranks.map(function(rank){
      processedRanks[rank._id] = rank.name;
    });

    this.setState({
      ranks: processedRanks
    });
  },

  handleSubmit: function(e) {
    if (e) { e.preventDefault(); }
    var that = this;
    addClass({
      classTitle:this.refs.classTitle.getValue().trim(),
      dayOfWeek:this.refs.day.getValue(),
      startTime:this.refs.startTime.getValue().trim(),
      endTime:this.refs.endTime.getValue().trim(),
      classType:this.refs.classtype.getValue()
    });

  },

  addClassComplete: function() {
    this.transitionTo('/classes');
  },
  addClassFailed: function(err) {
    console.error('Adding a class failed: ', err);
    this.transitionTo('/classes');
  },

  render: function() {
    var emptyWarn;
    var submitButton;
    if (!this.state.emptyvalid){
      emptyWarn = (
        <Alert bsStyle="danger" id="alert">
          <p><strong>Please fill all text box</strong></p>
        </Alert>
      )
    }
    return (
      <div className="addClass container">
        <form>
          <h2> Enter new class information:</h2>
          {emptyWarn}
          <Input type="text" label="Class Title" ref="classTitle" name="classTitle" placeholder="Class Title" />
          <Input type="select" label="Day of Week" ref="day" name="day">
            <option value="" disabled defaultValue className="notDisplay">Select Day of Week</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thurday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </Input>
          <Input label="Class Time" wrapperClassName='wrapper'>
            <Row>
              <Col xs={6}>
                <Input type='time' ref="startTime" name="startTime" />
              </Col>
              <Col xs={6}>
                <Input type='time' ref="endTime" name="endTime" />
              </Col>
            </Row>
          </Input>
          <RankInput label="Class Type" ref="classtype" name="classtype" ranks={this.state.ranks} formType="class" />

          <AlertDismissable visable={!this.state.valid} />

          <Button onClick={this.handleSubmit}>Save</Button>
        </form>
      </div>
    );
  }
});
