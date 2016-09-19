'use strict';

import React from 'react';
import MatchList from './MatchList';
import {
	selectMatch} from 'Actions/teams.js'
import { connect } from 'react-redux'
import moment from 'moment';


const mapTeamstoDate = (matches) => {
	const startDate = Date.UTC(2016,5,6,0,0,0,0);
	const endDate =   Date.UTC(2016,6,11,0,0,0,0);
	const oneDay = 86400000;
	var diffDays = Math.round(Math.abs(( startDate - endDate )/(oneDay)));
	var calendar = {};
	let i = 0;
	while (i < diffDays) {
		//Save to temp value bevause the start is mutable
		var dayStart = startDate + (oneDay*i);
		 calendar[dayStart] =  matches.filter(match => {
			 var timestamp =  parseInt(match.start);
			 if( timestamp > dayStart  &&  timestamp < dayStart + oneDay ){
				 return true;
			 }
	   	})
	    i++;
	}
	return calendar;
}

const getMoment = (timestamp) => (
	moment(parseInt(timestamp))
)

const mapStateToProps = (state) => {
  return {
	userteam: state.get('user:team'),
	usermatch: state.get('user:match'),
    matches: state.get('app:matches'),
	calendar: mapTeamstoDate(state.get('app:matches')),
	moment: getMoment,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectMatch: (dbid) => {
      dispatch(selectMatch(dbid))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchList);
