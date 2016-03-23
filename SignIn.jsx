// App component - represents the whole app
SignIn = React.createClass({
  getInitialState() {
    return {
      // hideCompleted: false
    }
  },

  // // This mixin makes the getMeteorData method work
  // mixins: [ReactMeteorData],
 
  // // Loads items from the Tasks collection and puts them on this.data.tasks
  // getMeteorData() {
  //   let query = {};
 
  //   return {
  //     dishes: Dishes.find(query, {sort: {createdAt: -1}}).fetch(),
  //     currentUser: Meteor.user()
  //   };
  // },
 
  // renderDishes() {
  //   return this.data.dishes.map((dish) => {
  //     const currentUserId = this.data.currentUser && this.data.currentUser._id;
 
  //     return <Dish
  //       key={dish._id}
  //       dish={dish} />;
  //   });
  // },

  // handleSubmit(event) {
  //   event.preventDefault();
 
  //   // Find the text field via the React ref
  //   const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
  //   Meteor.call('addDish', text);
  //   Meteor.call('getAllRecords', 'seany')

  //   // Clear form
  //   ReactDOM.findDOMNode(this.refs.textInput).value = '';
  // },

  render() {

    return (
      <div className='container'>
        <AccountsUIWrapper />
          <div>
            <a href='myorder'>Go to my order</a>
          </div>
          <div>
            <a href='myprofile'>Go to my profile</a>
          </div>
          <div>
            <a href='orderHistory'>Go to order history</a>
          </div>
      </div>
    );
  }
});