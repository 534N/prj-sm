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

  getDishSpicyMin() {
    return parseInt(ReactDOM.findDOMNode(this.refs.dishSpicyMin).value.trim());
  },

  getDishSpicyMax() {
    return parseInt(ReactDOM.findDOMNode(this.refs.dishSpicyMax).value.trim());
  },

  getDishNote() {
    return ReactDOM.findDOMNode(this.refs.dishNote).value.trim();
  },

  getDishSupply() {
    return parseInt(ReactDOM.findDOMNode(this.refs.dishSupply).value.trim());
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
        <li>菜名: 
          <input
            type="text"
            ref="dishName"
            defaultValue={this.props.dish.name} />
        </li>
        <li>价格: 
          <input
            type="text"
            ref="dishPrice"
            defaultValue={this.props.dish.price} />
        </li>
        <li>单位: 
          <input
            type="text"
            ref="dishUnit"
            defaultValue={this.props.dish.unit} />
        </li>
        <li>最低辣度: 
          <input
            type="text"
            ref="dishSpicyMin"
            defaultValue={this.props.dish.spicyMin} />
        </li>
        <li>最高辣度: 
          <input
            type="text"
            ref="dishSpicyMax"
            defaultValue={this.props.dish.spicyMax} />
        </li>
        <li>备注: 
          <input
            type="text"
            ref="dishNote"
            defaultValue={this.props.dish.note} />
        </li>
        <li>每日供应量: 
          <input 
            type="text"
            ref="dishSupply"
            defaultValue={this.props.dish.supply} />
        </li>
        <li>
          <span></span>
          <span className='control'>
            <div className='button remove small' onClick={this.handleDeleteDish}>删除</div>
          </span>
        </li>
      </ul>
    );
  }
});