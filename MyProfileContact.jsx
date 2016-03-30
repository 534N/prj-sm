MyProfileContact = React.createClass({
  propTypes: {
    contact: React.PropTypes.object.isRequired
  },

  getContactID() {
    return this.props.contact._id;
  },

  getAddress() {
    return ReactDOM.findDOMNode(this.refs.address).value.trim();
  },

  getPhone() {
    return ReactDOM.findDOMNode(this.refs.phone).value.trim();
  },

  getEmail() {
    return ReactDOM.findDOMNode(this.refs.email).value.trim();
  },

  render() {
    return (
      <ul className='contact-info'>
        <li>地址: 
          <span>
            <input
              type="text"
              ref="address"
              defaultValue= {this.props.contact.address} />
          </span>
        </li>
        <li>电话: 
          <span> 
            <input
              type="text"
              ref="phone"
              defaultValue={this.props.contact.phone} />
          </span>
        </li>
        <li>电邮: 
          <span>
            <input
              type="text"
              ref="email"
              defaultValue={this.props.contact.email} />
          </span>
        </li>
      </ul>
    );
  }
});