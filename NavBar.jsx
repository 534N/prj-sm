const {Router, Link, browserHistory} = ReactRouter;

NavBar = React.createClass({
  getInitialState: function() {
    return {};
  },
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    return (
      <div id='top-nav'>
        <div className='links'>
          <Link to='/myorder' className={`link ${this._activeClass('myorder')}`}>今日订单</Link>
          <Link to='/orderhistory' className={`link ${this._activeClass('orderhistory')}`}>历史订单</Link>
          <Link to='/myprofile' className={`link ${this._activeClass('myprofile')}`}>账户管理</Link>
        </div>
        <div className='avatar'>
          <AccountsUIWrapper />
        </div>

      </div>
    );
  },

  _activeClass: function(route) {
    return this.context.router.isActive(route) ? 'active' : '';
  }
});