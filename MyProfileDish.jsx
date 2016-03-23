MyProfileDish = React.createClass({
  propTypes: {
    dish: React.PropTypes.object.isRequired
  },

  getDishID() {
    return this.props.dish._id;
  },

  getDishName() {
    return ReactDOM.findDOMNode(this.refs.dishName).value.trim();
  },

  getDishPrice() {
    return parseFloat(ReactDOM.findDOMNode(this.refs.dishPrice).value.trim());
  },

  getDishUnit() {
    return ReactDOM.findDOMNode(this.refs.dishUnit).value.trim();
  },

  getDishNote() {
    return ReactDOM.findDOMNode(this.refs.dishNote).value.trim();
  },

  setDishDefaultName() {
    ReactDOM.findDOMNode(this.refs.dishName).value = ReactDOM.findDOMNode(this.refs.dishName).defaultValue;
  },

  setDishDefaultPrice() {
    ReactDOM.findDOMNode(this.refs.dishPrice).value = ReactDOM.findDOMNode(this.refs.dishPrice).defaultValue;
  },

  handleDeleteDish(e) {
    e.preventDefault();
    Meteor.call('deleteDish', this.props.dish._id);
  },

  render() {
    return (
      <ul>
        <li>Name: 
          <input
            type="text"
            ref="dishName"
            defaultValue={this.props.dish.name} />
        </li>
        <li>Price: 
          <input
            type="text"
            ref="dishPrice"
            defaultValue={this.props.dish.price} />
        </li>
        <li>Unit: 
          <input
            type="text"
            ref="dishUnit"
            defaultValue={this.props.dish.unit} />
        </li>
        <li>Note: 
          <input
            type="text"
            ref="dishNote"
            defaultValue={this.props.dish.note} />
        </li>
        <button onClick={this.handleDeleteDish}>Delete this dish</button>
      </ul>
    );
  }
});