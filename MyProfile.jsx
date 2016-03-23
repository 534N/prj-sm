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
      schedules: Schedules.find(query).fetch(),
      currentUser: Meteor.user()
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
    const contactID = this.refs.myProfileContact.getContactID();
    const address = this.refs.myProfileContact.getAddress();
    const phone = this.refs.myProfileContact.getPhone();
    const email = this.refs.myProfileContact.getEmail();

    const contact = {address: address, phone: phone, email: email};
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
    const scheduleID = this.refs.myProfileSchedule.getScheduleID()
    const schedule = this.refs.myProfileSchedule.getSchedule();
    // console.log(scheduleID);
    // console.log(schedule);


    // console.log(text);
    Meteor.call('setProfileInfo', contactID, contact, dishIDs, dish, scheduleID, schedule);
  },

  handleAddDish(e) {
    e.preventDefault();

    const dishName = ReactDOM.findDOMNode(this.refs.newDishName).value.trim();
    const dishPrice = parseFloat(ReactDOM.findDOMNode(this.refs.newDishPrice).value.trim());
    const dishUnit = ReactDOM.findDOMNode(this.refs.newDishUnit).value.trim();
    const dishNote = ReactDOM.findDOMNode(this.refs.newDishNote).value.trim();
    const dishOwner = this.data.currentUser.username;
    // console.log(dishName);
    // console.log(dishPrice);
    // console.log(dishUnit);
    // console.log(dishNote);
    const dish = {name: dishName, price: dishPrice, unit: dishUnit, note: dishNote, owner: dishOwner};
    Meteor.call('addDish', dish);

    ReactDOM.findDOMNode(this.refs.newDishName).value = "";
    ReactDOM.findDOMNode(this.refs.newDishPrice).value = "";
    ReactDOM.findDOMNode(this.refs.newDishUnit).value = "";
    ReactDOM.findDOMNode(this.refs.newDishNote).value = "";
  },

  handleAddSchedule(e) {
    e.preventDefault();

    let schedule = ReactDOM.findDOMNode(this.refs.newSchedule).value.trim();
    let scheduleOwner = this.data.currentUser.username;
    Meteor.call('addSchedule', schedule, scheduleOwner);

    ReactDOM.findDOMNode(this.refs.newSchedule).value = "";
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
            <div>
              Dish Name: <input 
                type="text"
                ref="newDishName"
                placeholder="Dish Name" />
              $: <input 
                type="text"
                ref="newDishPrice"
                placeholder="Dish Price" />
              Unit: <input 
                type="text"
                ref="newDishUnit"
                placeholder="Dish Unit" />
              Note: <input 
                type="text"
                ref="newDishNote"
                placeholder="Dish Note" />
              <button type="button" onClick={this.handleAddDish}>Add Dish</button>
            </div>
            {this.renderDishes()}
          </div>

          <div>
            <h2>Schedules Information</h2>
            <div>
              Schedule: <input 
                type="text"
                ref="newSchedule"
                placeholder="New Schedule Time" />
              <button type="button" onClick={this.handleAddSchedule}>Add Schedule</button>
            </div>
            {this.renderSchedules()}
          </div>
          <button type="button" onClick={this.handleSubmit}>Save Change</button>
        </form>
      </div>
    );
  }
});