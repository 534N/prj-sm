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