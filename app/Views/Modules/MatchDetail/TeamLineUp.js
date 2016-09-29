'use strict';

import  React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import {StaggeredMotion, spring} from 'react-motion';
import prefix from 'react-prefixr';


class TeamLineUp extends Component {

    constructor(props) {
        super(props)
		if(props.animationDone){
            this.state = {opacity:1, y:0};
        }else{
			this.state = {opacity:0, y:10};
		};

		this.getStyles = this.getStyles.bind(this);
    }

	componentWillReceiveProps(nextProps) {
		if(nextProps.animationDone){
            this.setState({opacity:1, y:0});
        };
	}

	getStyles(prevStyles) {
		return prevStyles.map((_, i) => {
			 if(i === 0){
				 return {
					 opacity: spring(this.state.opacity, {stiffness: 390, damping: 30}),
					 y:spring(this.state.y, {stiffness: 390, damping: 30})
				 }
			  }
			return {
				opacity: spring(prevStyles[i - 1].opacity, {stiffness: 390, damping: 30}),
				y:spring(prevStyles[i - 1].y, {stiffness: 390, damping: 30})
			}
		});
	}

    render() {
			const { name, players, lineup, substitutions, cards} = this.props;
			let type = "Team";
			let  teamPlayers = players;
			if(!lineup){
				teamPlayers = [
					{
						dbid: "nokey",
						shortName: "TBC"
					}
				]
			}else{
				teamPlayers = teamPlayers.filter((p)=>{
					return p.squadRole == "starting";
				});
				let pos = ['GK', 'DF', 'MF', 'FW'];
				teamPlayers.sort((a,b)=>{
					return pos.indexOf(a.position) - pos.indexOf(b.position)
				});
			}

			var getSubstitutions = function(dbid) {
				if(substitutions.data.hasOwnProperty(dbid)){
					return `(${substitutions.data[dbid].playerOn.shortName}${getCards(substitutions.data[dbid].playerOn.dbid)}, ${substitutions.data[dbid].matchTimeString})`;
				}

			}

			var getCards = function(dbid) {
				var lookup = {
					"first-yellow": "*",
					"second-yellow": "**",
				}

				if(cards.data.hasOwnProperty(dbid)){
					return `${lookup[cards.data[dbid].cardType]}`;
				}
				return '';

			}
			return (
				<div className="MatchLineUp" key={name}>
					<h3 className="MatchLineUp-team">{name} Line up</h3>
					<StaggeredMotion
					  defaultStyles={teamPlayers.map(t=>({opacity:0, y:10} ))}
					  styles={this.getStyles}>
					  {interstyles =>
						   <ul className="MatchLineUp-lineup">
							  {interstyles.map((s, i) =>
								  <li key={teamPlayers[i].dbid} style = {prefix({opacity:s.opacity, transform:`translateY(${s.y}px)`})}>{teamPlayers[i].shortName}{getCards(teamPlayers[i].dbid)} {getSubstitutions(teamPlayers[i].dbid)}</li>
								)}
						  </ul>
					  }
					</StaggeredMotion>
				</div>
			)
		}
}







export default TeamLineUp
