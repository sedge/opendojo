var React = require('react');
var Input = module.exports = React.createClass({
	getValue: function() {
		return this.refs[this.props.name].getDOMNode().value;
	},
	render: function() {
		return (
			<div className="form-group">
				<label className="control-label">
					<span>
						{this.props.label}
					</span>
				</label>
				<input ref={this.props.name} type={this.props.type} placeholder={this.props.placeholder} className="form-control" />
			</div>
		);
	}
});
