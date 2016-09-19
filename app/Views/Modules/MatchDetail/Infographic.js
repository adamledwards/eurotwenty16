'use strict';

import  React, { PropTypes } from 'react';
import prefix from 'react-prefixr';
import yellowSvg from './svgs/yellow-card-icon.svg';
import redSvg from './svgs/red-card-icon.svg';
import offsideSvg from './svgs/offside-icon.svg';
import cornersSvg from './svgs/corners-icon.svg';
import foulsSvg from './svgs/fouls-icon.svg';
import goalSvg from './svgs/goal-icon.svg';
import possessionSvg from './svgs/possession-icon.svg';
import shotsSvg from './svgs/shots-icon.svg';
import shotsOffTargetSvg from './svgs/shots-off-target-icon.svg';
import shotsOnTargetSvg from './svgs/shots-on-target-icon.svg';


const Infographic = ({match, cards}) => {
		if(match.currentState == "0"){
			return null;
		}
		var stats = {};
		if(match.hasOwnProperty('possession')){
			stats.possession = {
				data:JSON.parse(match.possession),
				svg: possessionSvg,
				name:"Possession"
			}
		}

		if(match.hasOwnProperty('shots')){
			stats.shots = {
				data:JSON.parse(match.shots),
				svg: shotsSvg,
				name:"Shots"
			}
		}
		if(match.hasOwnProperty('shotsOnTarget')){
			stats.shotsOnTarget = {
				data:JSON.parse(match.shotsOnTarget),
				svg: shotsOnTargetSvg,
				name:"Shots on target"
			}
		}
		if(match.hasOwnProperty('shotsOffTarget')){
			stats.shotsOffTarget = {
				data:JSON.parse(match.shotsOffTarget),
				svg: shotsOffTargetSvg,
				name:"Shots off target"
			}
		}
		if(match.hasOwnProperty('corners')){
			stats.corners = {
				data:JSON.parse(match.corners),
				svg: cornersSvg,
				name:"Corners"
			}
		}
		if(match.hasOwnProperty('offsides')){
			stats.offsides = {
				data:JSON.parse(match.offsides),
				svg: offsideSvg,
				name:"Offsides"
			}
		}

		if(match.hasOwnProperty('fouls')){
			stats.fouls = {
				data:JSON.parse(match.fouls),
				svg: foulsSvg,
				name:"Fouls"
			}
		}

		return (
			<div className="row MatchDetail-stat">
				<div className="col-sm-2">
					<div className="MatchDetail-stat-item MatchDetail-stat-item--goal MatchDetail-statsWrapper">
						<div dangerouslySetInnerHTML={goalSvg} />
						<span className="MatchDetail-stat-title">Goals</span>
						<div className="MatchDetail-stat-item">
							<span className="MatchDetail-stat-team">{match.homeTeam}</span>
							<span className="MatchDetail-stat-value">{match.homeGoals}</span>
						</div>
						<div className="MatchDetail-stat-item">
							<span className="MatchDetail-stat-team">{match.awayTeam}</span>
							<span className="MatchDetail-stat-value">{match.awayGoals}</span>
						</div>
					</div>
				</div>

				{
					Object.keys(stats).map((key, i)=>

						(
							<div key={key} className= {i ==4 ? "col-sm-2 " : "col-sm-2 col-sm-offset-1"}>
								<div className={"MatchDetail-statsWrapper MatchDetail-stat-item MatchDetail-stat-item--"+key}>
									<div dangerouslySetInnerHTML={stats[key].svg} />
									<span className="MatchDetail-stat-title">{stats[key].name}</span>
									<div className="MatchDetail-stat-item">
										<span className="MatchDetail-stat-team">{match.homeTeam}</span>
										<span className="MatchDetail-stat-value">{stats[key].data.H}</span>
									</div>
									<div className="MatchDetail-stat-item">
										<span className="MatchDetail-stat-team">{match.awayTeam}</span>
										<span className="MatchDetail-stat-value">{stats[key].data.A}</span>
									</div>
								</div>
							</div>
						)

					)
				}
				<div className="col-sm-2 col-sm-2 col-sm-offset-1">
					<div className="MatchDetail-statsWrapper MatchDetail-stat-item MatchDetail-stat-item--cards">
						<div dangerouslySetInnerHTML={yellowSvg} />
						<span className="MatchDetail-stat-title">Yellow Cards</span>
						<div className="MatchDetail-stat-item">
							<span className="MatchDetail-stat-team">{match.homeTeam}</span>
							<span className="MatchDetail-stat-value">{cards.H.yellow}</span>
						</div>
						<div className="MatchDetail-stat-item">
							<span className="MatchDetail-stat-team">{match.awayTeam}</span>
							<span className="MatchDetail-stat-value">{cards.A.yellow}</span>
						</div>
					</div>
				</div>
				<div className="col-sm-2 col-sm-offset-1">
					<div className="MatchDetail-statsWrapper MatchDetail-stat-item MatchDetail-stat-item--cards">
						<div dangerouslySetInnerHTML={redSvg} />
						<span className="MatchDetail-stat-title">Red Cards</span>
						<div className="MatchDetail-stat-item">
							<span className="MatchDetail-stat-team">{match.homeTeam}</span>
							<span className="MatchDetail-stat-value">{cards.H.red}</span>
						</div>
						<div className="MatchDetail-stat-item">
							<span className="MatchDetail-stat-team">{match.awayTeam}</span>
							<span className="MatchDetail-stat-value">{cards.A.red}</span>
						</div>
					</div>
				</div>
			</div>
		)
	}








export default Infographic
