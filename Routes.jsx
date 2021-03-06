// The component with all of the routes
const {Router, Route, IndexRoute, browserHistory} = ReactRouter;

Routes = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={Authenticator} />
          <Route path='signin' component={SignIn} />
          <Route path='register' component={Register} />
          <Route path='myorder' component={Authenticator}>
            <IndexRoute component={MyOrder} />
          </Route>
          <Route path='myprofile' component={Authenticator}>
            <IndexRoute component={MyProfile} />
          </Route>
          <Route path='orderhistory' component={Authenticator}>
            <IndexRoute component={MyOrderHistory} />
          </Route>
          <Route path='mycontrol' component={Authenticator}>
            <IndexRoute component={MyControl} />
          </Route>
        </Route>
      </Router>
    );
  }
});
