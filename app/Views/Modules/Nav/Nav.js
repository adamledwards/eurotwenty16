'use strict';

import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router';
import classNames from 'classnames';
import TeamColours from '../Styles';
import Modal from '../Modal';
import {StaggeredMotion, spring} from 'react-motion';
import prefix from 'react-prefixr';

class Nav extends Component {
	constructor(props) {
	   super(props);
	   this.links = [
		   {
			   copy:"Select a Team",
			   pathname:'/menu/select-team'
		   },
		   {
			   copy:"Push Notifications",
			   pathname:'/menu/push'
		   }
	   ];

 	}

	getStyles(prevStyles) {
		return prevStyles.map((_, i) => {
			 if(i === 0){
				  return {
					  opacity: spring(1),
					  y:spring(0)
				  }
			  }
			return {
				opacity: spring(prevStyles[i - 1].opacity),
				y:spring(prevStyles[i - 1].y)
			}
		})
	}


	render() {
		const {userteam, hover, modal} = this.props;
		let links = this.links;
		let teamStyles = {};
		 if(!hover){
			 if(userteam){
				 teamStyles.color = TeamColours[userteam.name].textcolour;
			 }
		 } else {
			 teamStyles.color = TeamColours[hover.name].textcolour;
		 }

		return (
			<StaggeredMotion
			  defaultStyles={links.map(t=>({opacity:0, y:10} ))}
			  styles={this.getStyles}>
			  {interStyles =>
				  <ul style={teamStyles} className="Modal-menu">
				  	{interStyles.map((s, index) =>
						<li key={links[index].pathname} style={prefix({opacity:s.opacity, transform:`translateY(${s.y}px)`})}>
							<Link to={{pathname:links[index].pathname}}>{links[index].copy}</Link>
						</li>
					)}
					</ul>
				}
			</StaggeredMotion>
		)
	}
}


export default Nav
