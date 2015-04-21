var TerminalCheckMixin = module.exports = {
  componentWillMount: function() {
    if (this.props.terminalMode) {
      return this.transitionTo('terminal');
    }
  }
};