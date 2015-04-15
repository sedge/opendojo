var React = require('react');
var {
  Modal
} = require('react-bootstrap');

var Welcome = module.exports = React.createClass({
  getInitialState: function() {
    var checked = true;
    if(localStorage.getItem("welcomed")) {
      checked = false;
    }
    return {modalOpen: checked};
  },

  componentDidMount: function() {
    localStorage.setItem("welcomed", "true");
  },

  handleHide: function() {
    this.setState({modalOpen: false});
  },

  render: function() {
    if (this.state.modalOpen) {
      return (
        <div className="Welcome container">
          <Modal {...this.props} title='Welcome to Project Nariyuki - The OpenDojo CMS!'
            bsStyle='primary'
            animation={true}
            onRequestHide={this.handleHide}
          >
            <div className='modal-body'>
              To get started, simply click on any one of the 6 modules on the left menu bar to see your
              latest lists of registered <strong>students</strong>, belt <strong>ranks</strong>, <strong>classes</strong>, or <strong>attendance</strong> schedules.
                  You can also send e-mail <strong>notifications</strong>, or open up the mobile class check-in&nbsp;
              <strong>terminal</strong> at any time as well.

              <p>
                For more information, simply click on Extras -> Usage Guide on the top right of the app screen.
              </p>
            </div>
          </Modal>
        </div>
      );
    }

    else {
      return <span />;
    }
  }
});
