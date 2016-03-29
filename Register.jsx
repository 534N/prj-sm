// App component - represents the whole app
Register = React.createClass({
  getInitialState() {
    return {
      // hideCompleted: false
    }
  },

  render() {

    return (
      <div id='register'>

        <input ref='username' type='text' name='username' />
        <input ref='password' type='password' name='password' on/>
        <input ref='cpassword' type='password' name='cpassword' on/>

        <button onClick={this._createUser} > Register </button>
      </div>
    );
  },

  _createUser() {
    const username = React.findDOMNode(this.refs.username);
    const password = React.findDOMNode(this.refs.password);
    const cpassword = React.findDOMNode(this.refs.cpassword);

    if (password.value !== cpassword) {
      this.setState({
        warning: 'Passwords do not match'
      });
    } else {
      this.setState({
        warning: null
      });
      Meteor.createUser(username.value, password.value);

    }
  }

});