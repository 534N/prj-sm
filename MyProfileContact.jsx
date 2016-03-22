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
      <ul>
        <li>Address: 
          <input
            type="text"
            ref="address"
            defaultValue= {this.props.contact.address} />
        </li>
        <li>Phone: 
          <input
            type="text"
            ref="phone"
            defaultValue={this.props.contact.phone} />
        </li>
        <li>Email: 
          <input
            type="text"
            ref="email"
            defaultValue={this.props.contact.email} />
        </li>
      </ul>
    );
  }
});