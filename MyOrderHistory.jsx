MyOrderHistory = React.createClass({
  getInitialState() {
    return {
      search: false,
      historyFrom: '',
      historyTo: '',
      viewMode: 'Daily',
      day: ''
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

  //formate date to yyyy/mm/dd
  formatDate(year, month, day) {
    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }
    
    return [year, month, day].join('/');
  },

  //store the dates that have orders and also the number of orders of that date
  getDaysCounts(days, day, track) {
    if (this.state.viewMode == "Monthly") {
      const split = day.split('/');
      day = [split[0], split[1]].join('/');
    }

    if (!days.length) {
      days.push({date: day, count: 1});
    } else {
      if (days[track.index].date == day) {
        days[track.index].count += 1;
      } else {
        days.push({date:day, count: 1});
        track.index++;
      }
    }

    return days;
  },

  //check if the from <= date < to
  orderDateInRange(date, from, to) {
    let inRange = false;
    if (from && to) {
      if (date >= from && date < to) {
        inRange = true;
      }
    } else if (from && !to) {
      if (date >= from) {
        inRange = true;
      }
    } else if (!from && to) {
      if (date < to) {
        inRange = true;
      }
    } else {
      inRange = true;
    }
    return inRange;
  },

  handleDayOrder(e) {
    e.preventDefault();
    
    this.setState({
      day: e.target.text
    });
  },

  handleView(e) {
    e.preventDefault();

    const view = e.target.text.match(/(.*)\sView/);
    this.setState({
      viewMode: view[1],
      day: ''
    });
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

  renderOrderBasedOnViewMode() {
    // if (this.state.search) {
      if (this.state.day) {
        const startDay = new Date(this.state.day);
        const endDay = new Date(new Date(this.state.day).getTime() + 60 * 60 * 24 * 1000);

        const historyFrom = this.state.historyFrom ? new Date(new Date(this.state.historyFrom).toLocaleDateString()) : '';
        const historyTo = this.state.historyTo ? new Date(new Date(this.state.historyTo).getTime() + 60 * 60 * 24 * 1000) : '';
        
        return this.data.orders.map((order) => {
          if (this.state.viewMode == "Daily") {
            if (order.createdAt >= startDay && order.createdAt < endDay) {
              return (<div key={order._id}>{this.renderOrder(order)}</div>);
            }
          } else if (this.state.viewMode == "Monthly") {
            if (this.orderDateInRange(order.createdAt, historyFrom, historyTo)) {
              if (order.createdAt.getFullYear() == startDay.getFullYear() && order.createdAt.getMonth() == startDay.getMonth()) {
                return (<div key={order._id}>{this.renderOrder(order)}</div>);
              }
            }
          }
        });
      }
    // }
  },

  renderViewModes() {
    // if (this.state.search) {
      let views = ['Daily View', 'Monthly View'];
      return (
        <ul>
        {
          views.map((view) => {
            return (
              <li key={view}>
                <a href='#' onClick={this.handleView}>{view}</a>
              </li>
            )
          })
        }
        </ul>
      )
    // }
  },

  renderTimeList() {
    // if (this.state.search) {
      let days = [];
      let day = '';
      let track = {};
      track.index = 0;

      const historyFrom = this.state.historyFrom ? new Date(new Date(this.state.historyFrom).toLocaleDateString()) : '';
      const historyTo = this.state.historyTo ? new Date(new Date(this.state.historyTo).getTime() + 60 * 60 * 24 * 1000) : '';

      this.data.orders.forEach((order) => {
        if (this.orderDateInRange(order.createdAt, historyFrom, historyTo)) {
          day = this.formatDate(order.createdAt.getFullYear().toString(), (order.createdAt.getMonth()+1).toString(), order.createdAt.getDate().toString());
          days = this.getDaysCounts(days, day, track);
        }
      });

      return (
        <ul>
        {
          days.map((d) => {
            return (
              <li key={d.date}>
                <a href='#' onClick={this.handleDayOrder}>{d.date}</a>
                <span>count: {d.count}</span>
              </li>
            );
          })
        }
        </ul>
      )
    // }
  },

  renderSummary() {
    // if (this.state.search) {
      if (this.state.day) {
        const startDay = new Date(this.state.day);
        const endDay = new Date(new Date(this.state.day).getTime() + 60 * 60 * 24 * 1000);

        const historyFrom = this.state.historyFrom ? new Date(new Date(this.state.historyFrom).toLocaleDateString()) : '';
        const historyTo = this.state.historyTo ? new Date(new Date(this.state.historyTo).getTime() + 60 * 60 * 24 * 1000) : '';

        let summary = {};
        let totalPrice = 0;
        this.data.orders.forEach((order) => {
          if (this.state.viewMode == "Daily") {
            if (order.createdAt >= startDay && order.createdAt < endDay) {
              if (Object.keys(summary).length == 0 && JSON.stringify(summary) === JSON.stringify({})) {
                summary = order.items;
              } else {
                Object.keys(order.items).map(key => {
                  const item = order.items[key];
                  summary[key].quantity += order.items[key].quantity;
                });
              }
              totalPrice += order.totalPrice;
            }
          } else if (this.state.viewMode == "Monthly") {
            if (this.orderDateInRange(order.createdAt, historyFrom, historyTo)) {
              if (order.createdAt.getFullYear() == startDay.getFullYear() && order.createdAt.getMonth() == startDay.getMonth()) {
                if (Object.keys(summary).length == 0 && JSON.stringify(summary) === JSON.stringify({})) {
                  summary = order.items;
                } else {
                  Object.keys(order.items).map(key => {
                    const item = order.items[key];
                    summary[key].quantity += order.items[key].quantity;
                  });
                }
                totalPrice += order.totalPrice;
              }
            }
          }
        });
        
        return (
          <div>
            <h2>Summary</h2>
            <ul>
            {
              Object.keys(summary).map((key) => {
                const dish = summary[key];
                if (dish.quantity === 0) {
                  return;
                }
                
                return (
                  <li key={key}> {dish.name} 单价: ${dish.price.toFixed(2)} 数量: {dish.quantity}{dish.unit} 总额: ${(dish.price * dish.quantity).toFixed(2)}</li>
                )
              })
            }
            </ul>
            总计: ${totalPrice.toFixed(2)}
          </div>
        );
      }
    // }
  },

  handleSearch(e) {
    e.preventDefault();

    const historyFrom = ReactDOM.findDOMNode(this.refs.historyFrom).value.trim();
    const historyTo = ReactDOM.findDOMNode(this.refs.historyTo).value.trim();

    this.setState({
      search: true,
      historyFrom: historyFrom,
      historyTo: historyTo,
      viewMode: 'Daily',
      day: ''
    });
  },

  handleClearSearch(e) {
    e.preventDefault();

    this.setState({
      search: false,
      historyFrom: '',
      historyTo: '',
      viewMode: '',
      day: ''
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

        {/*<div>
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
        </div>*/}

        <div>
          {this.renderViewModes()}
        </div>
        <div>
          {this.renderTimeList()}
        </div>
        <div>
          {this.renderOrderBasedOnViewMode()}
        </div>

        <div>
          {this.renderSummary()}
        </div>
      </div>
    );
  }
});