// App component - represents the whole app
App = React.createClass({
  getInitialState() {
    console.debug('APP');
    return {};
  },

  render() {
    return (
      <div className='wrap'>
        {this.props.children}
      </div>
    );
  }
});