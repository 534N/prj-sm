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
    const taskClassName = (this.props.order.checked ? 'checked' : '');
    console.debug(this.props.order);
    return (
      <li className={taskClassName}>
        <div>Order: {this.props.order._id} [{this.props.order.createdAt.toString()}]</div>
        <div>Total Price: {this.props.order.totalPrice}</div>
        <div>Total Quantity: {this.props.order.totalQuantity}</div>
        <table>
          <tbody>
          {
            this._renderItem()
          }
          </tbody>
        </table>
        <div>Customer</div>
        <div>Name: {this.props.order.customer.name}</div>
        <div>Phone: {this.props.order.customer.phone}</div>
        <div>Comment: {this.props.order.comment}</div>
      </li>
    );
  }
});