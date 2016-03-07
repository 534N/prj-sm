// Task component - represents a single todo item
// const {
//   RaisedButton
// } = MUI;

Order = React.createClass({
  getInitialState() {
    return {
      new: !this.props.order.existing,
      processing: false,
    }
  },

  propTypes: {
    order: React.PropTypes.object.isRequired,
  },
 
  componentDidMount() {
    if (this.state.new) {
      Meteor.call('sendSMS', this.props.order.customer.phone, this.props.order.totalPrice);
    }
    // console.debug('componentWillUpdate');
    // console.debug(this.props.order, !this.props.order.existing, !this.state.processing);
    // if (!this.props.order.existing && !this.state.processing) {
    //   
    // }
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
        new: this.state.new,//!this.props.order.existing && !this.state.processing,
        processing: this.state.processing,
        completed: this.props.order.completed,
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
          $ { this.props.order.totalPrice.toFixed(2) }
        </td>
        <td className='other'>
          { this.props.order.pickup }
        </td>
        <td className='other'>
          { this.props.order.comment }
        </td>
        <td className='other'>
          <div className='button start' onClick={this._startProcessing}>开始处理</div>
          <div className='button progress' onClick={this._finishProcessing}>处理完毕</div>
          {
            this.props.order.completed && 
            <div className='done'>{moment(this.props.order.completedAt).format('LT')}</div>
          }
        </td>
      </tr>
    );
  },

  _startProcessing() {
    this.setState({
      processing: true,
      new: false,
    });
  },

  _finishProcessing() {
    Meteor.call('completeOrder', this.props.order._id);
    this.setState({
      processing: false,
      new: false,
    });
  }
});