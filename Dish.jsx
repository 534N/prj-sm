// Task component - represents a single todo item
Dish = React.createClass({
  propTypes: {
    dish: React.PropTypes.object.isRequired,
  },
 
  deleteThisTask() {
    Meteor.call('removeTask', this.props.dish._id);
  },
 
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const dishClassName = (this.props.dish.checked ? 'checked' : '');;
    return (
      <li className={dishClassName}>
        <button className='delete' onClick={this.deleteThisTask}>
          &times;
        </button>
 
        <input
          type='checkbox'
          readOnly={true}
          checked={this.props.dish.checked}
          onClick={this.toggleChecked} />
          <span className='text'>
          <strong>{this.props.dish.username}</strong>: {this.props.dish.text}
        </span>
      </li>
    );
  }
});