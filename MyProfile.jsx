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
			dishCount: Dishes.find(query).count(),
			schedules: Schedules.find(query).fetch()
		};
	},

	renderContacts() {
		//return MyProfileContact component
		//set ref value
		return this.data.contacts.map((contact) => {
			return <MyProfileContact
				ref="myProfileContact"
				key={contact._id}
				contact={contact} />;
		});
	},

	renderDishes() {
		//return MyProfileDish component
		//set unique ref value for each dish
		let count = -1;
		return this.data.dishes.map((dish) => {
			count++;
			return <MyProfileDish
				ref={"myProfileDish"+count}
				key={dish._id}
				dish={dish} />;
		});
	},

	renderSchedules() {
		//return MyProfileSchedule component
		//set ref value
		return this.data.schedules.map((schedule) => {
			return <MyProfileSchedule
				ref="myProfileSchedule"
				key={schedule._id}
				schedule={schedule} />;
		});
	},

	handleSubmit(e) {
		e.preventDefault();

		//get contacts info via this.refs
		let contactID = this.refs.myProfileContact.getContactID();
		let address = this.refs.myProfileContact.getAddress();
		let phone = this.refs.myProfileContact.getPhone();
		let email = this.refs.myProfileContact.getEmail();

		let contact = {address: address, phone: phone, email: email};
		// console.log(contactID);
		// console.log(contact);

		//get every dish info via this.refs
		let dish = [];
		let dishIDs = [];
		for (let i = 0; i < this.data.dishCount; i++) {
			let dishID = this.refs['myProfileDish'+i].getDishID();
			let dishName = this.refs['myProfileDish'+i].getDishName();
			let dishPrice = this.refs['myProfileDish'+i].getDishPrice();
			let dishUnit = this.refs['myProfileDish'+i].getDishUnit();
			let dishNote = this.refs['myProfileDish'+i].getDishNote();
			
			// console.log(dishID);
			dishIDs.push(dishID);
			dish.push({name: dishName, price: dishPrice, unit: dishUnit, note: dishNote});
		}
		// console.log(dishIDs);
		// console.log(dish);

		//get the schedule via this.refs
		let scheduleID = this.refs.myProfileSchedule.getScheduleID()
		let schedule = this.refs.myProfileSchedule.getSchedule();
		// console.log(scheduleID);
		// console.log(schedule);


		// console.log(text);
		Meteor.call('setProfileInfo', contactID, contact, dishIDs, dish, scheduleID, schedule);
	},

	render() {
		return (
			<div className="container">
				<header>
					<h1>Profile</h1>
				</header>

				<form>
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
					<button type="button" onClick={this.handleSubmit}>Submit</button>
				</form>
			</div>
		);
	}
});