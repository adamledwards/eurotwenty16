'use strict';

import React, {Component} from 'react';

import { selectTeam, selectMatch } from 'Actions/teams.js';
import { connect } from 'react-redux'
import View from './Overview'

const mapStateToProps = (state) => {
  return {
    userteam: state.get('user:team'),
    teams: state.get('app:teams'),
    groups: state.get('app:groups'),
    isMobile: state.get('app:isMobile')
  }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onHomeClick: () => {
    		dispatch(selectTeam(false));
            dispatch(selectMatch(false))
        }
    }
}


 export default connect(mapStateToProps,mapDispatchToProps)(View)
