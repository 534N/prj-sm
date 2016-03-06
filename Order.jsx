// Task component - represents a single todo item
// const {
//   RaisedButton
// } = MUI;

Order = React.createClass({
  getInitialState() {
    return {
      processing: false,
    }
  },

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
        if (item.quantity === 0) {
          return;
        }

        return (
          <li key={key}> {item.name} x {item.quantity}{item.unit} </li>
        )
      })
    );
  },
 
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const orderClassName = classNames(
      'order',
      {
        checked: this.props.order.checked,
        new: !this.props.order.existing && !this.state.processing,
        processing: this.state.processing
      }
    );

    return (
      <tr className={orderClassName}>
        <td>
          <div className='customer-info'>
            下单时间: {moment(this.props.order.createdAt).format('L')} {moment(this.props.order.createdAt).format('LT')}, 电话: {this.props.order.customer.phone}
          </div>
          <ul>
            { this._renderItem() }
          </ul>
        </td>
        <td className='other price'>
          $ { this.props.order.totalPrice }
        </td>
        <td className='other'>
          { this.props.order.pickup }
        </td>
        <td className='other'>
          { this.props.order.comment }
        </td>
        <td className='other'>
          <div className='button start' onClick={this._startProcessing}>开始处理</div>
          <div className='button progress'>处理完毕</div>
        </td>
      </tr>
    );
  },

  _startProcessing() {
    this.setState({
      processing: true,
    });
  }
});