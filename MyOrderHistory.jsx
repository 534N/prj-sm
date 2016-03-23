MyOrderHistory = React.createClass({
  getInitialState() {
    return {
      search: false,
      historyFrom: '',
      historyTo: ''
    }
  },

  mixins: [ReactMeteorData],

  getMeteorData() {
    let query = {};

    if (Meteor.user() && Meteor.user().username) {
      query = {owner: Meteor.user().username};
    }

    return {
      orders: Orders.find(query, {sort: {createdAt: -1}}).fetch()
    };
  },

  renderItem(items) {
    return (
      Object.keys(items).map(key => {
        const item = items[key];
        if (item.quantity === 0) {
          return;
        }

        return (
          <li key={key}> {item.name} x {item.quantity}{item.unit} </li>
        )
      })
    );
  },

  renderOrder(order) {
    return (
      <div>
        <div className='customer-info'>
          下单时间: {moment(order.createdAt).format('L')} {moment(order.createdAt).format('LT')}, 电话: {order.customer.phone}
        </div>
        <ul>
          {this.renderItem(order.items)}
        </ul>
        <div className='other price'>
          $ {order.totalPrice.toFixed(2)}
        </div>
        <div className='other'>
          {order.pickupDay}
        </div>
        <div className='other'>
          {order.pickupTime}
        </div>
        <div className='other'>
          {order.comment}
        </div>
        <br />
      </div>
    );
  },

  renderHistoryOrder() {
    if (this.state.search) {
      // console.log(this.state.historyFrom);
      // console.log(this.state.historyTo);
      const historyFrom = this.state.historyFrom ? new Date(new Date(this.state.historyFrom).toLocaleDateString()) : '';
      const historyTo = this.state.historyTo ? new Date(new Date(this.state.historyTo).getTime() + 60 * 60 * 24 * 1000) : '';
      return this.data.orders.map((order) => {
        if (historyFrom && historyTo) {
          if (order.createdAt >= historyFrom && order.createdAt < historyTo) {
            return (<div key={order._id}>{this.renderOrder(order)}</div>);
          }
        } else if (historyFrom && !historyTo) {
          if (order.createdAt >= historyFrom) {
            return (<div key={order._id}>{this.renderOrder(order)}</div>);
          }
        } else if (!historyFrom && historyTo) {
          if (order.createdAt < historyTo) {
            return (<div key={order._id}>{this.renderOrder(order)}</div>);
          }
        } else {
          return (<div key={order._id}>{this.renderOrder(order)}</div>);
        }
      });
    }
  },

  handleSearch(e) {
    e.preventDefault();

    const historyFrom = ReactDOM.findDOMNode(this.refs.historyFrom).value.trim();
    const historyTo = ReactDOM.findDOMNode(this.refs.historyTo).value.trim();

    this.setState({
      search: true,
      historyFrom: historyFrom,
      historyTo: historyTo
    });
  },

  handleClearSearch(e) {
    e.preventDefault();

    this.setState({
      search: false,
      historyFrom: '',
      historyTo: ''
    });

    ReactDOM.findDOMNode(this.refs.historyFrom).value = "";
    ReactDOM.findDOMNode(this.refs.historyTo).value = "";
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Order History</h1>
        </header>

        <div>
          From: <input 
          type="text"
          ref="historyFrom"
          placeholder="yyyy/mm/dd" />
          To: <input 
          type="text"
          ref="historyTo"
          placeholder="yyyy/mm/dd" />
          <button type="button" onClick={this.handleSearch}>Search</button>
          <button type="button" onClick={this.handleClearSearch}>Clear</button>
        </div>

        <div>
          {this.renderHistoryOrder()}
        </div>
      </div>
    );
  }
});