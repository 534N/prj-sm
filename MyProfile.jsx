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
      let dishSupply = this.refs['myProfileDish'+i].getDishSupply();
      
      //if dish name and price are not empty, then update
      if (dishName && dishPrice) {
        dishIDs.push(dishID);
        dish.push({name: dishName, price: dishPrice, unit: dishUnit, note: dishNote, supply: dishSupply});
      } else {
        //if dish name and price are both empty, reset to default value
        this.refs['myProfileDish'+i].setDishDefaultName();
        this.refs['myProfileDish'+i].setDishDefaultPrice();
      }
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
    const dishSupply = parseInt(ReactDOM.findDOMNode(this.refs.newDishSupply).value.trim());
    const dishOwner = this.data.currentUser.username;
    // console.log(dishName);
    // console.log(dishPrice);
    // console.log(dishUnit);
    // console.log(dishNote);
    const dish = {name: dishName, price: dishPrice, unit: dishUnit, note: dishNote, supply: dishSupply, owner: dishOwner};

    //if both dish name and price are there, then insert
    if (dishName && dishPrice) {
      Meteor.call('addDish', dish);
    }

    ReactDOM.findDOMNode(this.refs.newDishName).value = "";
    ReactDOM.findDOMNode(this.refs.newDishPrice).value = "";
    ReactDOM.findDOMNode(this.refs.newDishUnit).value = "";
    ReactDOM.findDOMNode(this.refs.newDishNote).value = "";
    ReactDOM.findDOMNode(this.refs.newDishSupply).value = "";
  },

  handleAddSchedule(e) {
    e.preventDefault();

    let schedule = ReactDOM.findDOMNode(this.refs.newSchedule).value.trim();
    let scheduleOwner = this.data.currentUser.username;

    //if schedule is there, then insert
    if (schedule) {
      Meteor.call('addSchedule', schedule, scheduleOwner);
    }

    ReactDOM.findDOMNode(this.refs.newSchedule).value = "";
  },

  render() {
    return (
      <div id='my-profile' className="container">
        <form>
          <div className='master-control'>
            <div className="button grant large" onClick={this.handleSubmit}>保存</div>
          </div>
          <div className='header'>联系方式</div>
          { this.renderContacts() }

          <div className='header'>菜品</div>
          <div id='create-dish-panel'>
            <h4>添加新菜品</h4>
            <ul>
              <li>
                菜名: 
                <span>
                  <input 
                    type="text"
                    ref="newDishName"
                    placeholder="菜名" />
                </span>
              </li>
              <li>
                价格:
                <span>
                  <input 
                    type="text"
                    ref="newDishPrice"
                    placeholder="价格" />
                </span>
              </li>
              <li>
                单位: 
                <span>
                  <input 
                    type="text"
                    ref="newDishUnit"
                    placeholder="单位" />
                </span>
              </li>
              <li>
                备注: 
                <span>
                  <input 
                    type="text"
                    ref="newDishNote"
                    placeholder="备注" />
                </span>
              </li>
              <li>
                每日供应量: 
                <span>
                  <input 
                    type="text"
                    ref="newDishSupply"
                    placeholder="供应量" />
                </span>
              </li>
              <li>
                <span></span>
                <span className='control'>  
                  <div className='button prime small' type="button" onClick={this.handleAddDish}>添加</div>
                </span>
              </li>
            </ul>
          </div>
          {this.renderDishes()}

          <div id='schedule-info'>
            <div className='header'>提货时间</div>
            <ul>
              <li>添加提货时间: 
                <span>
                  <input 
                    type="text"
                    ref="newSchedule"
                    placeholder="上午取 (11:00 - 13:00)" />
                </span>
              </li>
              <li>
                <span></span>
                <span className='control'>
                  <div className="button prime small" onClick={this.handleAddSchedule}>确定</div>
                </span>
              </li>
            </ul>
            {this.renderSchedules()}
          </div>
          <div className='master-control'>
            <div className="button grant large" onClick={this.handleSubmit}>保存</div>
          </div>
        </form>
      </div>
    );
  }
});