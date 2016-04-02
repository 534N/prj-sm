MyProfileDish = React.createClass({
  propTypes: {
    dish: React.PropTypes.object.isRequired
  },

  // //image upload related
  // getInitialState() {
  //   return {
  //     fileType: '',
  //     imagePreviewUrl: ''
  //   }
  // },

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

  // //image upload related
  // getDishImageFileType() {
  //   return this.state.fileType;
  // },

  // getDishImagePreviewUrl() {
  //   return this.state.imagePreviewUrl;
  // },

  setDishDefaultName() {
    ReactDOM.findDOMNode(this.refs.dishName).value = ReactDOM.findDOMNode(this.refs.dishName).defaultValue;
  },

  setDishDefaultPrice() {
    ReactDOM.findDOMNode(this.refs.dishPrice).value = ReactDOM.findDOMNode(this.refs.dishPrice).defaultValue;
  },

  // //image upload related
  // handleChange(e) {
  //   e.preventDefault();

  //   let reader = new FileReader();
  //   let file = e.target.files[0];
  //   console.log(file.type);
  //   console.log(reader.result);
  //   reader.onloadend = () => {
  //     console.log(reader.result);
  //     console.log(file.type.split('/')[1]);
  //     this.setState({
  //       fileType: file.type.split('/')[1],
  //       imagePreviewUrl: reader.result
  //     });
  //     const name = file.name;
  //     const path = '/public/nKgTu3AEmAbDR2dWH' + '/' + name;
  //     Meteor.call('saveDishImage', reader.result, path);
  //   }

  //   reader.readAsDataURL(file);
  // },

  handleDeleteDish(e) {
    e.preventDefault();
    Meteor.call('deleteDish', this.props.dish._id);
  },

  render() {
    // //image upload related
    // let {imagePreviewUrl} = this.state;
    // let $imagePreview = null;
    // if (imagePreviewUrl) {
    //   $imagePreview = (<img src={imagePreviewUrl} />);
    // }
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
        <li>备注: 
          <input
            type="text"
            ref="dishNote"
            defaultValue={this.props.dish.note} />
        </li>
        {/*image upload related
        <li>图片:
          <input
            type="file"
            name="fileToUpload"
            id="fileToUpload"
            onChange={this.handleChange} />
          {$imagePreview}
        </li>*/}
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