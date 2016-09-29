'use strict';

import  React, { PropTypes } from 'react';
import { Link } from 'react-router';
const Team = ({name, dbid, team, onClick, onMouseOver, onMouseLeave, style }) => (
	<li className="col-xs-7" style={style} >
		<Link to={{pathname:"/", state:{tdbid: dbid} }}  onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>{team}</Link>
	</li>
)

Team.propTypes = {
	onClick: PropTypes.func.isRequired,
  	name: PropTypes.string.isRequired,
  	team: PropTypes.string.isRequired
}

export default Team
