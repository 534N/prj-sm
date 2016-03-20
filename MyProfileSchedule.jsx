MyProfileSchedule = React.createClass({
	propTypes: {
		schedule: React.PropTypes.object.isRequired
	},

	getScheduleID() {
		return this.props.schedule._id;
	},

	getSchedule() {
		let schedules = [];
		for (var i = 0; i < this.props.schedule.schedule.length; i++) {
			let value = ReactDOM.findDOMNode(this.refs["schedule"+i]).value.trim();
			if (value) {
				schedules.push(ReactDOM.findDOMNode(this.refs["schedule"+i]).value.trim());
			}
		}
  	return schedules;
  },

  handleDeleteSchedule(e) {
  	e.preventDefault();
  	// console.log($(e.target).prev().prop('defaultValue'));
  	let schedule = $(e.target).prev().prop('defaultValue');
  	Meteor.call('deleteSchedule', schedule, this.props.schedule.owner);
  },

	_renderSchedule() {
		return (
			Object.keys(this.props.schedule.schedule).map(key => {
				const item = this.props.schedule.schedule[key];
				if (!item) {
					return;
				}

				return (
					<li key={key}> 
						<input
							type="text"
							ref={"schedule"+key}
							defaultValue={item} />
						<button onClick={this.handleDeleteSchedule}>
		          &times;
		        </button>
					</li>
				)
			})
		);
	},

	render() {
		return (
			<ul>
				{this._renderSchedule()}
			</ul>
		);
	}
});