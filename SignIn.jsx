const {Router, Route, IndexRoute, browserHistory} = ReactRouter;

SignIn = React.createClass({
  getInitialState() {
    return {
      renderRegister: false
    }
  },

  componentDidMount() {
    if (Meteor.user()) {
      browserHistory.push('/myorder');
    }

    const username = React.findDOMNode(this.refs.username);
    username.focus();

  },

  render() {

    const iconClass = classNames(
      'big-icon',
      {
        'icon-account_circle': !this.state.renderRegister,
        'icon-person_add': this.state.renderRegister
      }
    );


    return (
      <div id='sign-in'>
        <span className={iconClass}></span>
        <div className='panel'>
          <input ref='username' type='text' name='username' placeholder='用户名' />
          <input ref='password' type='password' name='password' placeholder='密码'/>
          {
            this.state.renderRegister &&
            <input ref='cpassword' type='password' name='cpassword' placeholder='密码确认'/>
          }
          {
            this.state.warning &&
            <span className='warning'>{this.state.warning}</span>
          }
          {
            this.state.renderRegister &&
            <div className='submit' onClick={this._createUser} > 完成 </div>
          }
          {
            !this.state.renderRegister &&
            <div className='submit' onClick={this._login} > 登录 </div>
          }
          {
            this.state.renderRegister &&
            <div className='switch' onClick={this._renderSignIn} > 返回登录 </div>
          }
          {
            !this.state.renderRegister &&
            <div className='switch' onClick={this._renderRegister} > 注册 </div>
          }
        </div>
        
      </div>
    );
  },

  _login() {
    const username = React.findDOMNode(this.refs.username);
    const password = React.findDOMNode(this.refs.password);


    Meteor.loginWithPassword(username.value, password.value, (res) => {
      if (res && res.error) {
        let warning = '';
        switch (res.reason) {
          case 'User not found': 
            warning = '用户名不存在';
            break;

          case 'Incorrect password': 
            warning = '密码不正确';
            break;

          default:
            console.error(res.error);
            break;
        }
        
        this.setState({
          warning: warning
        });
      } else {
        browserHistory.push('/myorder');
      }
    });
  },

  _renderSignIn() {
    this.setState({
      renderRegister: false,
      warning: null
    });
    const username = React.findDOMNode(this.refs.username);
    username.focus();
  },

  _renderRegister() {
    this.setState({
      renderRegister: true,
      warning: null
    });
    const username = React.findDOMNode(this.refs.username);
    username.focus();
  },

  _createUser() {
    const username = React.findDOMNode(this.refs.username);
    const password = React.findDOMNode(this.refs.password);
    const cpassword = React.findDOMNode(this.refs.cpassword);

    if (password.value !== cpassword.value) {
      this.setState({
        warning: '两次密码输入不一致'
      });
    } else {
      this.setState({
        warning: null
      });
      Meteor.createUser(username.value, password.value);

    }
  }

});