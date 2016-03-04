// Task component - represents a single todo item
Order = React.createClass({
  propTypes: {
    order: React.PropTypes.object.isRequired,
  },
 
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('setChecked', this.props.order._id, ! this.props.order.checked);
  },

  _renderItem() {
    return (
      Object.keys(this.props.order.items).map(key => {
        const item = this.props.order.items[key];
        return (
          <tr key={key}>
            <td>{item.name}</td>
            <td>{item.quantity}{item.unit}</td>
            <td>${item.price}</td>
          </tr>
        )
      })
    );
  },
 
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const orderClassName = 'order ' + (this.props.order.checked ? 'checked' : '');
    console.debug(this.props.order);
    return (
      <li className={orderClassName}>
        <div className='summary'>
          <div className='info'>
            <div>订单号: {this.props.order._id}</div> 
            <div> 订餐时间: {moment(this.props.order.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </div>
            <div className='name'>姓名: {this.props.order.customer.name}</div>
            <div className='phone'>电话: {this.props.order.customer.phone}</div>
          </div>
          <div className='price'>
            ${this.props.order.totalPrice}
          </div>
        </div>
        <div className='customer'>
          
        </div>
        <table className='orders'>
          <tbody>
          {
            this._renderItem()
          }
          </tbody>
        </table>
        {
          this.props.order.comment.length > 0 &&
          <div className='comment'>备注: {this.props.order.comment}</div>
        }
      </li>
    );
  }
});