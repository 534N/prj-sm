MyProfileContact = React.createClass({
	propTypes: {
		contact: React.PropTypes.object.isRequired
	},

	render() {
		return (
			<ul>
				<li>Address: {this.props.contact.address}</li>
				<li>Phone: {this.props.contact.phone}</li>
				<li>Email: {this.props.contact.email}</li>
			</ul>
		);
	}
});