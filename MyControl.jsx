MyControl = React.createClass({

  mixins: [ReactMeteorData],
 
  getMeteorData() {
    let absoluteControlQuery = {};

    if (Meteor.user() && Meteor.user().username) {
      absoluteControlQuery = {
        owner: Meteor.user().username,
        type: 'absolute'
      };
    }

    return {
      absoluteControl: Controls.findOne(absoluteControlQuery),
      currentUser: Meteor.user()
    };
  },

  handleAbsoluteControlChange(e) {
    const owner = this.data.currentUser.username;
    const type = 'absolute';
    const close = e.target.checked;

    if (this.data.absoluteControl) {
      Meteor.call('setControl', owner, type, close);
    } else {
      const control = {owner: owner, type: type, close: close};
      Meteor.call('addControl', control);
    }
  },

  render() {
    return (
      <div>
        <div>
          <span>一键关店</span>
          <input
            type="checkbox"
            checked={(this.data.absoluteControl && this.data.absoluteControl.close) ? this.data.absoluteControl.close : false}
            onChange={this.handleAbsoluteControlChange} />
          关店
        </div>
      </div>
    );
  }
});