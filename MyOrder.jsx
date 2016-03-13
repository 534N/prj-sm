// App component - represents the whole app
MyOrder = React.createClass({
  getInitialState() {
    return {
      hideCompleted: true,
      current: 'incomplete'
    }
  },

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
 
  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let incompleteQuery = {};
    let completedQuery = {}

    const today = new Date(new Date().toLocaleDateString());
    const tomorrow = new Date(today.getTime() + 60 * 60 * 24 * 1000);
    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      incompleteQuery = {
        completed: false,
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      };

      completedQuery = {
        completed: true,
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      };
    }

    let data = {
      incompleteOrders: Orders.find(incompleteQuery, {sort: {createdAt: -1}}).fetch(),
      completedOrders: Orders.find(completedQuery, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Orders.find(incompleteQuery).count(),
      completedCount: Orders.find(completedQuery).count()
    };

    if (Meteor.user()) {
      const { username } = Meteor.user();
      data['contacts'] = Contacts.findOne({owner: username});
      data['owner'] = Meteor.user();
    }

    // return {
    //   incompleteOrders: Orders.find(incompleteQuery, {sort: {createdAt: -1}}).fetch(),
    //   completedOrders: Orders.find(completedQuery, {sort: {createdAt: -1}}).fetch(),
    //   incompleteCount: Orders.find(incompleteQuery).count(),
    //   completedCount: Orders.find(completedQuery).count(),
    //   contacts: Contacts.find({owner: userObj.username}).fetch(),
    //   currentUser: Meteor.user()
    // };
    return data;
  },
 
  renderIncompleteOrders() {
    console.debug('this.data', this.data)
    return this.data.incompleteOrders.map((order) => {
      if (order.totalQuantity === 0) {
        return;
      }

      return <Order
        key={order._id}
        order={order}
        contacts={this.data.contacts} />;
    });
  },

  renderCompletedOrders() {
    return this.data.completedOrders.map((order) => {
      if (order.totalQuantity === 0) {
        return;
      }

      return <Order
        key={order._id}
        order={order}
        contacts={this.data.contacts} />;
    });
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },


  _setCurrent(status) {
    this.setState({
      current: status
    });
  },

 
  render() {

    const optionClassName = classNames(
      'title',
      {
        'show-incomplete': this.state.current === 'incomplete',
        'show-completed': this.state.current === 'completed'
      }
    );

    const tabIncompleteClassName = classNames(
      'tab',
      {
        active: this.state.current === 'incomplete',
      }
    );

    const tabCompletedClassName = classNames(
      'tab',
      {
        active: this.state.current === 'completed',
      }
    );

    return (
      <div className='container' id='order-list'>
        <header>
          <div className='date'>{moment().format('LLLL')}</div>
          <div className={optionClassName}>
            <div className={tabIncompleteClassName} onClick={this._setCurrent.bind(this, 'incomplete')}>未处理订单 ({this.data.incompleteCount})</div>
            <div className={tabCompletedClassName} onClick={this._setCurrent.bind(this, 'completed')}>已完成订单 ({this.data.completedCount})</div>
          </div>
        </header>
 
        <table>
          <thead>
            <tr>
              <th>订单内容</th>
              <th>价格</th>
              <th>取货日期</th>
              <th>取货时间</th>
              <th>备注</th>
              <th>订单管理</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.current === 'incomplete' &&
            this.renderIncompleteOrders()
          }
          {
            this.state.current === 'completed' &&
            this.renderCompletedOrders()
          }
          </tbody>
        </table>
      </div>
    );
  }
});