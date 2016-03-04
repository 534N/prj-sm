// App component - represents the whole app
MyOrder = React.createClass({
  getInitialState() {
    console.debug('APP');
    return {
      hideCompleted: false
    }
  },

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
 
  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};
 
    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {completed: {$ne: true}};
    }
 
    return {
      orders: Orders.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Orders.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },
 
  renderOrders() {
    return this.data.orders.map((order) => {
      return <Order
        key={order._id}
        order={order} />;
    });
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },
 
  render() {
    return (
      <div className='container'>
        <header>
          <h1>Orders ({this.data.incompleteCount})</h1>
          <AccountsUIWrapper />
          <hr />
          <label className='hide-completed'>
            <input
              type='checkbox'
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label>
        </header>
 
        <ul>
          {this.renderOrders()}
        </ul>
      </div>
    );
  }
});