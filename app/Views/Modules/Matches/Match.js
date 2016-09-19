'use strict';

import  React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import States from '../MatchDetail/States';

const Match = (
	{match,
	moment,
	onClick,
	isPlaying}) => {
		var cn = classNames({
			'MatchItem': true,
			'MatchItem--isPlaying': isPlaying
		});
		var state = States[match.currentState];
		var getState = function(){

			let timestamp = parseInt(match.start);
			let today = new Date();
		    let now = today.getTime();

			if(today > timestamp && match.currentState !== "0"){

				return state.longName;
			}else {
				return `Kick off - ${moment(timestamp).format("HH:mm")}`;
			}
		}

		return (
			<Link className={cn} to={{pathname:`/match/${match.dbid}`}}>
				<span className="MatchItem-copy">
					<span className="MatchItem-game">
			        	{match.homeTeam} {state.hasScore ? match.homeGoals: null} {state.hasScore ? "\u2014": "vs"} {state.hasScore ? match.awayGoals: null} {match.awayTeam}
					</span>
					<span className="MatchItem-start">
						{getState()}
					</span>
					<span className="MatchItem-start">
						{match.stadium}
					</span>
				</span>
			</Link>
		)
	}



export default Match
