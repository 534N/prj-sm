MyOrderHistory = React.createClass({
  getInitialState() {
    return {
      search: false,
      historyFrom: '',
      historyTo: '',
      viewMode: 'Daily',
      day: '',
      customer: ''
    }
    moment.locale();
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
    if (this.state.viewMode === 'Monthly') {
      const split = day.split('/');
      day = [split[0], split[1]].join('/');
    }

    if (!days.length) {
      days.push({date: day, count: 1});
    } else {
      if (days[track.index].date === day) {
        days[track.index].count += 1;
      } else {
        days.push({date: day, count: 1});
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

  handleCustomerOrder(customer) {
    this.setState({
      customer: customer
    });
  },

  handleDayOrder(day) {
    this.setState({
      day: day
    });
  },

  handleView(mode) {
    this.setState({
      viewMode: mode,
      day: '',
      customer: ''
    });
  },

  renderItem(items) {

    return (
      Object.keys(items).map(key => {
        const item = items[key];

        // console.debug('item: ', item);
        if (item.quantity === 0) {
          return;
        }

        return (
          <li key={key}>
           <span className='name'>{item.name}</span>
           <span>{`${item.quantity} ${item.unit}`}</span>
           <span>{`$${item.quantity * item.price}`}</span>
          </li>
        )
      })
    );
  },

  renderOrder(order) {
    const format = this.state.viewMode === 'Daily' ? 'LT' : 'LLLL';
    const statusClass = classNames(
      'order-status',
      {
        completed: order.completed,
        dispatched: !order.completed && order.dispatched
      }
    );

    let status = '未处理';
    if (order.completed) {
      status = `完成 @ ${moment(order.completedAt).format(format)}`;
    } else if (order.dispatched) {
      status = `处理中`;
    }

    return (
      <div className='order-entry'>
        <div className='order-info'>
          <div className='order-number'>
            订单号 #{order.orderNumber ? order.orderNumber : order._id}
          </div>
          <div className='timestamp'>
            <span className="icon-schedule"></span> {moment(order.createdAt).format(format)}
          </div>
        </div>
        <div className={statusClass}>
          {status}
        </div>
        <ul>
          {this.renderItem(order.items)}
        </ul>
        <div className='order-summary'>
          <div className='customer-info'>
            <span className="icon-phone"></span> {order.customer.phone}
          </div>
          <div className='total'>
            <span className='small'>共计 </span>
            <span className='money'>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        {
          // <div className='other'>
          //   {order.pickupTime}
          //   {order.pickupDay} 
          // </div>
          // <div className='other'>
          //   {order.comment}
          // </div>
        }
      </div>
    );
  },

  renderOrderBasedOnViewMode() {
    if (this.state.day) {
      const startDay = new Date(this.state.day);
      const endDay = new Date(new Date(this.state.day).getTime() + 60 * 60 * 24 * 1000);

      const historyFrom = this.state.historyFrom ? new Date(new Date(this.state.historyFrom).toLocaleDateString()) : '';
      const historyTo = this.state.historyTo ? new Date(new Date(this.state.historyTo).getTime() + 60 * 60 * 24 * 1000) : '';
      
      return this.data.orders.map((order) => {
        if (this.state.viewMode === 'Daily') {
          if (order.createdAt >= startDay && order.createdAt < endDay) {
            return (
              <div className='order-container' key={order._id}>{this.renderOrder(order)}</div>
            );
          }
        } else if (this.state.viewMode === 'Monthly') {
          if (this.orderDateInRange(order.createdAt, historyFrom, historyTo)) {
            if (order.createdAt.getFullYear() === startDay.getFullYear() && order.createdAt.getMonth() === startDay.getMonth()) {
              return (
                <div className='order-container' key={order._id}>{this.renderOrder(order)}</div>
              );
            }
          }
        }
      });
    }

    if (this.state.customer) {
      const customer = this.state.customer;
      return this.data.orders.map((order) => {
        if (order.customer.phone === customer) {
          return (
            <div className='order-container' key={order._id}>{this.renderOrder(order)}</div>
          );
        }
      });
    }
  },

  renderViewModes() {
    const dailyClass = classNames(
      'view-mode',
      {
        active: this.state.viewMode === 'Daily'
      }
    );

    const monthClass = classNames(
      'view-mode',
      {
        active: this.state.viewMode === 'Monthly'
      }
    );

    const customerClass = classNames(
      'view-mode',
      {
        active: this.state.viewMode === 'Customer'
      }
    );

    return (
      <div className='view-mode-container'>
        <div href='#' className={dailyClass} onClick={this.handleView.bind(this, 'Daily')}>按日结算</div>
        <div href='#' className={monthClass} onClick={this.handleView.bind(this, 'Monthly')}>按月结算</div>
        <div href='#' className={customerClass} onClick={this.handleView.bind(this, 'Customer')}>按顾客结算</div>
      </div>
    )
  },

  renderTimeList() {
    // if (this.state.search) {
    //if view by customers
    if (this.state.viewMode == 'Customer') {
      let customers = [];
      let temp = {};
      
      this.data.orders.forEach((order) => {
        if (Object.keys(temp).length === 0 && JSON.stringify(temp) === JSON.stringify({})) {
          temp[order.customer.phone] = 1;
        } else {
          if (temp.hasOwnProperty(order.customer.phone)) {
            temp[order.customer.phone] += 1;
          } else {
            temp[order.customer.phone] = 1;
          }
        }
      });

      for (let customer in temp) {
        customers.push({customer: customer, count: temp[customer]});
      }
      //sort customer in descending order based on order count
      customers.sort((a, b) => {
        return parseInt(b.count) - parseInt(a.count);
      });

      return (
        <ul>
        {
          customers.map((c) => {
            const customerClass = classNames(
              'history-date',
              {
                active: this.state.customer === c.customer
              }
            );

            return (
              <li key={c.customer}>
                <div href='#' onClick={this.handleCustomerOrder.bind(this, c.customer)} className={customerClass}>
                  <span>{c.customer}</span>
                  <span className='small fade'> ({c.count}单)</span>
                </div>
              </li>
            );
          })
        }
        </ul>
      );
    } else {
      //else if view by either daily or monthly
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
            const dateClass = classNames(
              'history-date',
              {
                active: this.state.day === d.date
              }
            );

            return (
              <li key={d.date}>
                <div href='#' onClick={this.handleDayOrder.bind(this, d.date)} className={dateClass}>
                  <span>{d.date}</span>
                  <span className='small fade'> ({d.count}单)</span>
                </div>
              </li>
            );
          })
        }
        </ul>
      )
    }
    // }
  },

  renderSummary() {
    if (this.state.day || this.state.customer) {
      const startDay = new Date(this.state.day);
      const endDay = new Date(new Date(this.state.day).getTime() + 60 * 60 * 24 * 1000);

      const historyFrom = this.state.historyFrom ? new Date(new Date(this.state.historyFrom).toLocaleDateString()) : '';
      const historyTo = this.state.historyTo ? new Date(new Date(this.state.historyTo).getTime() + 60 * 60 * 24 * 1000) : '';

      let summary = {};
      let totalPrice = 0;
      this.data.orders.forEach((order) => {
        if (this.state.viewMode === 'Daily') {
          if (order.createdAt >= startDay && order.createdAt < endDay) {
            if (Object.keys(summary).length === 0 && JSON.stringify(summary) === JSON.stringify({})) {
              summary = order.items;
            } else {
              Object.keys(order.items).map(key => {
                const item = order.items[key];
                summary[key].quantity += order.items[key].quantity;
              });
            }
            totalPrice += order.totalPrice;
          }
        } else if (this.state.viewMode === 'Monthly') {
          if (this.orderDateInRange(order.createdAt, historyFrom, historyTo)) {
            if (order.createdAt.getFullYear() === startDay.getFullYear() && order.createdAt.getMonth() === startDay.getMonth()) {
              if (Object.keys(summary).length === 0 && JSON.stringify(summary) === JSON.stringify({})) {
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
        } else if (this.state.viewMode === 'Customer') {
          if (order.customer.phone === this.state.customer) {
            if (Object.keys(summary).length === 0 && JSON.stringify(summary) === JSON.stringify({})) {
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
      });
      
      return (
        <div>
          <div className='statement'>
            总计 <span className='money'>${totalPrice.toFixed(2)}</span>
          </div>

          <ul>
          {
            Object.keys(summary).map((key) => {
              const dish = summary[key];
              if (dish.quantity === 0) {
                return;
              }
              
              return (
                <li key={key}> 
                  <span>{dish.name}</span>
                  <span>{`总数: ${dish.quantity} ${dish.unit} `}</span>
                  <span>{`总额: $${(dish.price * dish.quantity).toFixed(2)}`}</span>
                </li>
              )
            })
          }
          </ul>
        </div>
      );
    }
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

    ReactDOM.findDOMNode(this.refs.historyFrom).value = '';
    ReactDOM.findDOMNode(this.refs.historyTo).value = '';
  },

  render() {
    return (
      <div id='order-history'>
        {/*<div>
          From: <input 
          type='text'
          ref='historyFrom'
          placeholder='yyyy/mm/dd' />
          To: <input 
          type='text'
          ref='historyTo'
          placeholder='yyyy/mm/dd' />
          <button type='button' onClick={this.handleSearch}>Search</button>
          <button type='button' onClick={this.handleClearSearch}>Clear</button>
        </div>*/}

        { this.renderViewModes() }
        <div className='content'>
          <div className='left'>
            { this.renderTimeList() }
          </div>
          <div className='right'>
            <div className='summary'>
              { this.renderSummary() }
            </div>
            { this.renderOrderBasedOnViewMode() }
          </div>

        </div>

        
      </div>
    );
  }
});