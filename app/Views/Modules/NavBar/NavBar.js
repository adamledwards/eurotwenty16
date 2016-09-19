'use strict';

import  React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import TeamColours from '../Styles';
import homeSvg from './home.svg';

const NavBar = ({userteam, hover, modal, onHomeClick}) => {
	let teamStyles ={}
	let home;
	let burger = classNames({
		'header-brand-menu': true,
		'active': modal
	 });

	 let cn = classNames({
 		'header-brand': true,
 		'modal-open': modal
 	 });
	 teamStyles.color = '#FFFFFF';
	 if(!hover){
		 if(userteam){
			 teamStyles.color = TeamColours[userteam.name].textcolour;
		 }
	 } else {
		 teamStyles.color = TeamColours[hover.name].textcolour;
	 }
	 if(userteam){
		home = (<Link className="header-brand-home" to={{pathname:'/'}} onClick={onHomeClick}>
		 	<div dangerouslySetInnerHTML={homeSvg} />
		 </Link>)
	 }
	 let burgerpath = {pathname:'/menu'};
	 if(modal){
		 burgerpath = {pathname:'/'};
	 }
	return (
		<section className="header-brand" className={cn} style={teamStyles}>

		 	<div className="container">
				<Link className="header-brand-logo" to={{pathname:'/'}} onClick={onHomeClick}>eurotwenty16.com</Link>

				<Link to={burgerpath} className={burger} style={teamStyles} >
					<span></span>
					<span></span>
					<span></span>
				</Link>
				{home}
			</div>
		</section>
	)
}

export default NavBar
