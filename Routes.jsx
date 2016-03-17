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
          <Route path='signin' component={SignIn} />
          <IndexRoute component={Index}/>
          <Route path='myorder' component={Authenticator}>
            <IndexRoute component={MyOrder} />
          </Route>
          <Route path='myprofile' component={Authenticator}>
            <IndexRoute component={MyProfile} />
          </Route>
        </Route>
      </Router>
    );
  }
});
