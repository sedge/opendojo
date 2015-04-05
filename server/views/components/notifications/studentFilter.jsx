var React = require('react');
var Reflux = require('reflux');

var { ListenerMixin } = Reflux;

var actions = require('../../actions/notificationActions.jsx');
var notificationStore = require('../../stores/notificationStore.jsx');

var studentStore = require('../../stores/studentStore.jsx');
var rankStore = require('../../stores/rankStore.jsx');

var {
  sortByKey,
  membershipStatusCalculator
} = require('../../bin/utils.jsx');

var {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Button,
  Input,
  Table,
  Panel
} = require('react-bootstrap');

var {
  blacklist
} = require('validator');

var EmailInput = require('../emailInput.jsx');

function filterByRank(students, rankId){
  var filteredStudents = [];

  if (rankId === 'none') {
    return students;
  }

  students.forEach(function(student) {
    if (student.rankId === rankId) {
      filteredStudents.push(student);
    }
  });

  return filteredStudents;
}

function filterByMembership(students, membershipStatus) {
  var filteredStudents = [];

  if (membershipStatus === "expired") {
    students.forEach(function(student) {
      if (membershipStatusCalculator(student.membershipExpiry) === "Expired") {
        filteredStudents.push(student);
      }
    });
    return filteredStudents;
  }

  if (membershipStatus === "active") {
    students.forEach(function(student) {
      if (membershipStatusCalculator(student.membershipExpiry) !== "Expired") {
        filteredStudents.push(student);
      }
    });
    return filteredStudents;
  }

  return students;
}

function filterByName(students, name) {
  if (!name || blacklist(name, " ").length === 0) {
    return students;
  }

  var filteredStudents = [];

  students.forEach(function(person){
    var studentName = person.firstName+' '+person.lastName;
    if(studentName.toLowerCase().indexOf(name)!== -1)
      filteredStudents.push(person);
  });

  return filteredStudents;
}

var StudentFilter = module.exports = React.createClass({
  mixins: [
    // State updates
    Reflux.connectFilter(studentStore, "students", function(students) {
      students.sort(sortByKey('lastName', 0));

      return students;
    }),
    Reflux.connectFilter(rankStore, "ranks", function(ranks) {
      var processedRanks = {};

      ranks.map(function(rank){
        processedRanks[rank._id] = rank.name;
      });

      return processedRanks;
    }),

    Reflux.connectFilter(notificationStore, 'recipients', function(payload) {
      if (payload.flag) {
        return this.state.recipients;
      }
      return payload.recipients.map(function(recipient) {
        return recipient._id;
      });
    })
  ],
  getInitialState: function() {
    return {
      recipients: [],
      searchResults: [],
      filters: {
        rank: "none",
        membership: "active"
      },
      all: false
    };
  },

  addCustomEmail: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (this.state.all) {
      return;
    }

    var emailRef = this.refs.customEmail;
    if (!emailRef.state.valid) {
      return;
    }

    var email = emailRef.getValue();
    if (!email.length || email.length <= 0) {
      return;
    }

    actions.addRecipient({
      email: email
    });
  },

  addRecipient: function(studentId) {
    return function() {
      actions.addRecipient({
        studentId: studentId
      });
    }
  },

  removeRecipient: function(studentId) {
    return function() {
      actions.removeRecipient(studentId);
    }
  },

  doSearch: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    var rankId =  this.refs.rankFilter.getValue();
    var membershipStatus = this.refs.membershipFilter.getValue();
    var name = this.refs.search.getValue();

    this.setState({
      filters: {
        rank: rankId,
        membership: membershipStatus,
        name: name
      }
    });
  },

  toggleAddAllAsRecipients: function() {
    if (this.state.all) {
      actions.removeAllRecipients();
    } else {
      actions.addAllRecipients();
    }

    this.setState({
      all: !this.state.all
    })
  },

  render: function() {
    var that = this;

    var customEmailProps = {
      type: 'text',
      ref: 'customEmail',
      name: 'customEmail',
      placeholder: "Add a custom email",
      allowEmpty: true
    };

    var searchProps = {
      type: 'text',
      ref: 'search',
      placeholder: "Search by name",
      onChange: this.doSearch
    };

    var rankProps = {
      type: 'select',
      ref: 'rankFilter',
      onChange: this.doSearch,
      label: 'Filter by rank:'
    };

    var membershipProps = {
      type: 'select',
      ref: 'membershipFilter',
      onChange: this.doSearch,
      label: 'Filter by membership status:',
      defaultValue: 'active'
    };

    var addAllButton;
    var customEmailField;
    var customEmailButton;
    var searchField;
    var rankFilterField;
    var membershipFilterField;
    var membershipFilterField;

    // If we've added everyone as a recipient, then render
    // disabled versions of all of the buttons without processing
    // filters or state.
    if (this.state.all) {
      addAllButton = (
        <Button bsSize='small' onClick={this.toggleAddAllAsRecipients} block>Remove all</Button>
      );
      customEmailField = (
        <EmailInput {...customEmailProps} disabled block />
      );
      customEmailButton = (
        <Button bsSize='small' onClick={this.addCustomEmail} block disabled>Add a custom address:</Button>
      );
      searchField = (
        <Input {...searchProps} disabled />
      );
      rankFilterField = (
        <Input {...rankProps} disabled />
      );
      membershipFilterField = (
        <Input {...membershipProps} disabled />
      );
    } else {
      var rankOptions = Object.keys(this.state.ranks).map(function(rankId) {
        return (
          <option value={rankId}>{that.state.ranks[rankId]}</option>
        );
      });
      rankOptions.splice(0,0, (
        <option value='none'>Select a rank (optional)</option>
      ));

      var sortedStudents = this.state.students;

      var rankFilter = this.state.filters.rank;
      var membershipFilter = this.state.filters.membership;
      var nameFilter = this.state.filters.name;

      if (rankFilter) {
        sortedStudents = filterByRank(sortedStudents, rankFilter);
      }
      if (membershipFilter) {
        sortedStudents = filterByMembership(sortedStudents, membershipFilter);
      }
      if (nameFilter) {
        sortedStudents = filterByName(sortedStudents, nameFilter);
      }

      var searchResults;
      if (sortedStudents && sortedStudents.length) {
        searchResults = sortedStudents.map(function(student) {
          var added = that.state.recipients.indexOf(student._id) === -1 ? false : true;
          var button;

          if (added) {
            button = (
              <Button key={student._id} bsStyle="danger" bsSize='small' onClick={that.removeRecipient(student._id)}>-</Button>
            );
          } else {
            button = (
              <Button key={student._id} bsSize='small' onClick={that.addRecipient(student._id)}>+</Button>
            );
          }

          return (
            <tr key={student._id}>
              <td>{student.lastName + ', ' + student.firstName}</td>
              <td>{button}</td>
            </tr>
          );
        });
      } else {
        searchResults = (
          <tr>
            <td>No results found!</td>
          </tr>
        );
      }

      addAllButton = (
        <Button bsSize='small' onClick={this.toggleAddAllAsRecipients} block>Email all</Button>
      );
      customEmailField = (
        <EmailInput {...customEmailProps} block />
      );
      customEmailButton = (
        <Button bsSize='small' onClick={this.addCustomEmail} block>Add a custom address:</Button>
      );
      searchField = (
        <Input {...searchProps} />
      );
      rankFilterField= (
        <Input {...rankProps}>
          {rankOptions}
        </Input>
      );
      membershipFilterField = (
        <Input {...membershipProps}>
          <option value='active'>Active</option>
          <option value='expired'>Expired</option>
          <option value='all'>All</option>
        </Input>
      );
    }

    return (
      <div id="studentFilter">
        <Panel header='Quick add'>
          <Row>
            <Col md={11}>
              <ButtonToolbar>
                {addAllButton}
                {customEmailButton}
              </ButtonToolbar>
            </Col>
          </Row>
          <Row>
            <Col md={11}>
              {customEmailField}
            </Col>
          </Row>
        </Panel>

        <Panel header='Filters'>
          <Row>
            <Col md={12}>
              {searchField}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {rankFilterField}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {membershipFilterField}
            </Col>
          </Row>
        </Panel>

        <Panel header="Results">
          <Row>
            <Col id="filterResults" md={12}>
              <Table bordered condensed>
                <tbody>
                  {searchResults}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Panel>
      </div>
    );
  }
});