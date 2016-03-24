TopNav = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div id='nav'>
        <div className='logo'></div>
        <div className='links'>
          <span className='button'>Orders</span>
          <span className='button'>History</span>
          <span className='button'>Profile</span>
        </div>
        <div className='auth-panel'>
          <AccountsUIWrapper />
        </div>
      </div>
    );
  }
});