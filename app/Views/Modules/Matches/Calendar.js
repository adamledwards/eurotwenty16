'use strict';

import  React, { Component, PropTypes } from 'react';
import Match from './Match';
import classNames from 'classnames';
import { withRouter } from 'react-router'
import ReactDOM from 'react-dom';

class Calendar extends Component {

	teamMatchDay() {
		const {matches, userteam, usermatch} = this.props;
		var teams = [];
		if(userteam){
			teams = userteam.matches;
		}

		if(usermatch){
			teams = [usermatch.dbid];
		}


		var dbids = matches.map(match => match.dbid);

		return dbids.filter((id) => teams.indexOf(id) !== -1)
	}

	componentDidMount () {

  	}

	render () {
		const {
			matches,
			moment,
			timestamp,
			matchesKey} = this.props;

			let matchday = this.teamMatchDay();

			let cn = classNames({
				'Calendar': true,
				'Calendar--matchday': matchday.length > 0,
				'Calendar--nogames': matches.length === 0

			});
			return (
				<div className={cn}>
					<div className="Calendar-container">
					<span className="Calendar-date">{moment(timestamp).format('D')}</span>
					{matches.map((match,i) => {
						return (
							<Match
							key={match.dbid}
							match = {match}
							moment = {moment}
							isPlaying = {matchday.indexOf(match.dbid)!== -1}
							index={i}
							/>
						)
					})}
				</div>
				</div>
			)
	}

}


Calendar.propTypes = {
	matches: PropTypes.array.isRequired,
}


export default Calendar
