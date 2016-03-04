// App component - represents the whole app
App = React.createClass({
  getInitialState() {
    console.debug('APP');
    return {};
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});