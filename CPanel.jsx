// App component - represents the whole app
CPanel = React.createClass({
  getInitialState() {
    console.debug('CPanel');
    return {
      // hideCompleted: false
    }
  },

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
 
  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};
 
    return {
      dishes: Dishes.find(query, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user()
    };
  },
 
  renderDishes() {
    return this.data.dishes.map((dish) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
 
      return <Dish
        key={dish._id}
        dish={dish} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('addDish', text);
    Meteor.call('getAllRecords', 'seany')

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  },

  render() {

    return (
      <div className='container'>
        <header>
          <h1>My Dishes</h1>

          <AccountsUIWrapper />

          { 
            this.data.currentUser &&
            <form className='new-dish' onSubmit={this.handleSubmit} >
              <input
                type='text'
                ref='textInput'
                placeholder='Type to add new dish' />
            </form>
          }
        </header>
 
        <ul>
          {this.renderDishes()}
        </ul>
      </div>
    );
  }
});