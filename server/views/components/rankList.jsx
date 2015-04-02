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
  Table,
  ButtonToolbar,
  Button

} = require('react-bootstrap');

var {
  sortByKey
} = require('../bin/utils.jsx');

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
      that.ranksUpdate(initialRanks);
    });
  },
  ranksUpdate: function(latestRanks) {
    var sortedArray;
    sortedArray = latestRanks.sort(sortByKey("sequence",0));
    this.setState({
      ranks: sortedArray
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
            <td>
              <ButtonToolbar>
                <Link to="singleRank" params={{
                  id: rank._id
                }}><Button bsSize="small">View</Button></Link>
              </ButtonToolbar>
            </td>
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
