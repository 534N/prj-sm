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
      if (order.totalQuantity === 0) {
        return;
      }

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
      <div className='container' id='order-list'>
        <header>
          <h1>未处理订单 ({this.data.incompleteCount})</h1>
          <div>
            <div className='button'></div>
          </div>
        </header>
 
        <table>
          <thead>
            <tr>
              <th>订单内容</th>
              <th>价格</th>
              <th>取货时间</th>
              <th>备注</th>
              <th>订单管理</th>
            </tr>
          </thead>
          <tbody>
            {this.renderOrders()}
          </tbody>
        </table>
      </div>
    );
  }
});