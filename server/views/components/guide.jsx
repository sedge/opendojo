/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2015 ChiYoung Choi, Yoav Gurevich, Kieran Sedgwick,
 *                    Alina Shtramwasser, Seneca College */

var React = require('react');
var {
    Modal,
    Button
    } = require('react-bootstrap');
var {
  Navigation
} = require('react-router');

var Guide = module.exports = React.createClass({
    mixins: [Navigation],

    getInitialState: function() {
      return {modalOpen: true};
    },

    handleHide: function() {
      this.transitionTo('/');
    },

    render: function() {
      if (this.state.modalOpen) {
        return (
          <div className="Guide container">
            <Modal {...this.props} title='OpenDojo User Guide'
              bsStyle='primary'
              animation={true}
              onRequestHide={this.handleHide}
            >
              <div className='modal-body'>
                There are 6 modules to this content management system. 4 of the modules allow you to
                view, add, edit, delete, or some variation of the 4 tasks.
                Clicking on any of the modules on the left menu bar will take you to their main view.

                <h3>Adding a Module Record</h3>
                <p>
                  The add button will always be
                  on the top right of the main list's section and labeled with the addition symbol (+). This
                  will take you to the "Add New" form of that respective module. Follow the validation format
                  of the input fields and you may either "Save" (the button is coloured in blue) or cancel at the bottom of the form.
                </p>

                <h3>Editing a Module Record</h3>
                <p>
                The editing form is designed in very much the same fashion as the add module. The "Edit" button will
                appear either in the main list view, or the single record view.
                </p>

                <h3>Deleting a Module Record</h3>
                <p>
                  You may remove a specific record at any given time either in the main view or the single record view using
                  by clicking on the orange "Delete" button.
                  Deleting will prompt an additional confirmation warning in case you might have pressed the button accidentally.
                </p>
                <h3>Sending Mass Notification E-Mails</h3>
                <p>
                  The built-in style editor in this view should provide you with all of the basic formatting requirements of any rich text e-mail body.
                  The header fields will dynamically provide one, multiple, or all the e-mails that are stored in the Student Records according
                  to your preference.
                </p>
              </div>
              <div className='modal-footer'>
                <Button bsStyle='info' onClick={this.handleHide} bsSize="large">Got It, Thanks!</Button>
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
