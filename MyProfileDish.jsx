MyProfileDish = React.createClass({
	propTypes: {
		dish: React.PropTypes.object.isRequired
	},

	render() {
		return (
			<ul>
				<li>Name: {this.props.dish.name}</li>
				<li>Price: {this.props.dish.price}</li>
				<li>Unit: {this.props.dish.unit}</li>
				<li>Note: {this.props.dish.note}</li>
			</ul>
		);
	}
});