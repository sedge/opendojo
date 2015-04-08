var React = require('react');
var { ListenerMixin } = require('reflux');

var rankActions = require('../actions/rankActions.jsx');
var rankStore = require('../stores/rankStore.jsx');

var {
 Link,
 Navigation
} = require('react-router');

var {
  Alert,
  Table
} = require('react-bootstrap');

var RankList = module.exports = React.createClass({
  mixins: [ListenerMixin, Navigation],
  getInitialState: function(){
    return {
      ranks: null
    };
  },
  componentWillMount: function() {
   var that = this;

    //initial ranks are returned on line 38 of rankStore in getInitialState
    this.listenTo(rankStore, this.ranksUpdate, function(initialRanks) {
      that.setState({
        ranks: initialRanks
      });
    });
  },
  ranksUpdate: function(latestRanks) {
    this.setState({
      ranks: latestRanks
    });
  },

  render: function() {
    var that = this;
    var content;
    var ranks = this.state.ranks;
    var view;
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
        
        return (
          <tr key={key++}>
            <td>{rank.name}</td>
            <td>{rank.sequence}</td>
            <td>{rank.color}</td>
            <td><Link to="singleRank" params={{
              id: rank._id
            }}>View</Link></td>
          </tr>
        );
      });

      view = (
        <Table>
          <thead>
            <th>Rank Title</th>
            <th>Rank Sequence</th>
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
        {view}
      </div>
    );
  }
});

module.exports = RankList;
