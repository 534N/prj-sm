// App component - represents the whole app
App = React.createClass({
  getInitialState() {
    console.debug('APP');
    return {};
  },

  render() {
    return (
      <div className='wrap'>
        {
          Meteor.user() &&
          <NavBar />
        }
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
});