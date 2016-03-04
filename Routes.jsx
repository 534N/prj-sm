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
          <IndexRoute component={Index}/>
          <Route path='myorder' component={MyOrder}/>
          <Route path='cpanel' component={CPanel}/>
          {
            // <Route path="/" component={HomePage} />
            // <Route path="login" component={LoginPage} />
            // <Route path="*" component={NotFoundPage} />
          }
        </Route>
      </Router>
    );
  }
});
