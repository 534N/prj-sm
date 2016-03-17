MyProfile = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData() {
		let query = {};

		if (Meteor.user() && Meteor.user().username) {
			query = {owner: Meteor.user().username};
		}

		return {
			contacts: Contacts.find(query).fetch(),
			dishes: Dishes.find(query).fetch(),
			schedules: Schedules.find(query).fetch()
		};
	},

	renderContacts() {
		return this.data.contacts.map((contact) => {
			return <MyProfileContact
				key={contact._id}
				contact={contact} />;
		});
	},

	renderDishes() {
		return this.data.dishes.map((dish) => {
			return <MyProfileDish
				key={dish._id}
				dish={dish} />;
		});
	},

	renderSchedules() {
		return this.data.schedules.map((schedule) => {
			return <MyProfileSchedule
				key={schedule._id}
				schedule={schedule} />;
		});
	},

	render() {
		return (
			<div className="container">
				<header>
					<h1>Profile</h1>
				</header>

				<div>
					<h2>Contacts Information</h2>
					{this.renderContacts()}
				</div>

				<div>
					<h2>Dishes Information</h2>
					{this.renderDishes()}
				</div>

				<div>
					<h2>Schedules Information</h2>
					{this.renderSchedules()}
				</div>
			</div>
		);

		// return (
		// 	<MyProfileSchedule
		// 		contact={this.data.contacts}
		// 		dish={this.data.dishes} />
		// );
	}
});