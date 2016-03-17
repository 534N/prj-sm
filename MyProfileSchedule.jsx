MyProfileSchedule = React.createClass({
	propTypes: {
		schedule: React.PropTypes.object.isRequired
	},

	_renderSchedule() {
		return (
			Object.keys(this.props.schedule.schedule).map(key => {
				const item = this.props.schedule.schedule[key];
				if (!item) {
					return;
				}

				return (
					<li key={key}> {item} </li>
				)
			})
		);

		// return (
		// 	this.props.schedule.schedule.map((item) => {
		// 		return (<li> {item} </li>);
		// 	})
		// );
	},

	render() {
		return (
			<ul>
				{this._renderSchedule()}
			</ul>
		);

		// return (
		// 	<div className="container">
		// 		<header>
		// 			<h1>{Meteor.user().username}'s Profile</h1>
		// 		</header>

		// 		<div>
		// 			<h2>Contacts Information</h2>
		// 			{this._renderContacts()}
		// 		</div>

		// 		<div>
		// 			<h2>Dishes Information</h2>
		// 		</div>

		// 		<div>
		// 			<h2>Schedules Information</h2>
		// 		</div>
		// 	</div>
		// );
	}
});