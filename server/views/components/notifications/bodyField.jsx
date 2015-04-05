var React = require('react');
var Reflux = require('reflux');

var Quill = require('quill');

var {
  Input
} = require('react-bootstrap');

var {
  isLength,
  stripLow,
  blacklist
} = require('validator');

var BodyField = module.exports = React.createClass({
  getInitialState: function() {
    var contents = this.props.contents;
    contents = contents || this.props.placeHolder || "<p>Enter your message here!</p>";

    return {
      valid: true,
      contents: contents
    };
  },

  componentDidMount: function() {
    var editor = new Quill("#editor", {
      modules: {
        'toolbar': { container: "#toolbar" },
        'link-tooltip': true
      },
      theme: "snow"
    });

    editor.on('text-change', this.onChange);

    this.setState({
      editor: editor
    });
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Never re-render or we lose the element.
    return false;
  },

  componentWillUpdate: function() {
    this.componentWillUnmount();
  },

  componentDidUpdate: function() {
    this.componentDidMount();
  },

  componentWillUnmount: function() {
    this.state.editor.off('text-change', this.onChange);
    this.state.editor.destroy();
  },

  componentWillReceiveProps: function(newProps) {
    // if ('contents' in newProps) {
    //   if (newProps.contents !== this.props.contents) {
    //     this.setEditorContents(this.state.editor, newProps.value);
    //   }
    // }
  },

  onChange: function(e) {
    if(e && e.preventDefault) e.preventDefault();

    var valid = true;
    var htmlContents = this.state.editor.getHTML();
    var stringContents = this.state.editor.getText();

    if (!stripLow(blacklist(stringContents, " "))) {
      valid = false;
    }

    if (!isLength(stringContents, 1, 1500)) {
      valid = false;
    }

    this.setState({
      valid: valid,
      contents: htmlContents
    });

    this.props.onChange();
  },

  getValue: function() {
    return this.state.contents;
  },

  render: function() {
    var feedback;

    if (!this.state.valid) {
      feedback = (
        <p><strong>An email body must be provided, up to a maximum of 1500 characters.</strong></p>
      );
    }

    var props = {
      type: 'text',
      ref: 'input',
      label: 'Subject',
      value: this.state.subject,
      placeholder: this.props.placeholder
    };

    return (
      <div id="notificationBodyField">
        <div id="toolbar" className="toolbar">
          <div className="ql-format-group">
            <select className="ql-size" defaultValue="13px">
              <option value="10px">Small</option>
              <option value="13px">Normal</option>
              <option value="18px">Large</option>
              <option value="32px">Huge</option>
            </select>
          </div>
          <div className="ql-format-group">
            <span className="ql-bold ql-format-button"></span>
            <span className="ql-format-separator"></span>
            <span className="ql-italic ql-format-button"></span>
            <span className="ql-format-separator"></span>
            <span className="ql-underline ql-format-button"></span>
          </div>
          <div className="ql-format-group">
            <span className="ql-list ql-format-button"></span>
            <span className="ql-format-separator"></span>
            <span className="ql-bullet ql-format-button"></span>
          </div>
          <div className="ql-format-group">
            <span className="ql-link ql-format-button"></span>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: this.state.contents }} id="editor"></div>
        {feedback}
      </div>
    );
  }
});