Authenticator = React.createClass({  
  mixins: [ReactMeteorData, ReactRouter.History],
  getMeteorData: function() {
    return {
      isAuthenticated: Meteor.userId() !== null
    };
  },
  componentWillMount: function() {
    // Check that the user is logged in before the component mounts
    if (!this.data.isAuthenticated) {
      this.history.pushState(null, '/signin');
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    // Navigate to a sign in page if the user isn't authenticated when data changes
    if (!this.data.isAuthenticated) {
      this.history.pushState(null, '/signin');
    }
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div>
        {/* Views will be rendered here */}
        {this.props.children}
      </div>
    );
  }
});