'use strict';

import React from 'react';
import TeamList from './TeamList';
import {RECEIVE_TEAMS,
	REQUEST_TEAMS,
	fetchTeam,
	selectTeam ,hoverTeam, selectMatch} from 'Actions/teams.js';
import { connect } from 'react-redux'
import $ from 'jquery';
import prefix from 'react-prefixr';

const mapStateToProps = (state) => {
  return {
    teams: state.get('app:teams')
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onTeamClick: (e,team, index) => {
		dispatch(selectTeam(team[index]));
      	dispatch(fetchTeam(team[index]));
		dispatch(selectMatch(false));
		$('.js-slideDown').css(prefix({transform:'translateY(0px)'}));
        $('.calendar-row').css(prefix({transform:'translateY(0px)'}));
    },
	onTeamHover: (e,team, index) => {
      	dispatch(hoverTeam(team[index]));
    },
	offTeamHover: () => {
      	dispatch(hoverTeam(false));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamList);
