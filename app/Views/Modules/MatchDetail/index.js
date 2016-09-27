import React, {Component} from 'react';
import { Router, Link } from 'react-router';
import { connect } from 'react-redux'
import MatchDetail from './MatchDetail'
import {fetchMatch, selectMatch} from 'Actions/teams.js'
import $ from 'jquery';
import prefix from 'react-prefixr';

const mapStateToProps = (state) => {
  return {
      usermatch: state.get('user:match'),
      matches: state.get('app:matches'),
      teams: state.get('app:teams'),
      userteam: state.get('user:team'),
      isMobile: state.get('app:isMobile')

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMatch: (dbid) => {
        dispatch(fetchMatch(dbid))
    },
    clearMatch: () => {
        $('.js-slideDown').css(prefix({transform:'translateY(0px)'}));
        $('.calendar-row').css(prefix({transform:'translateY(0px)'}));
        setTimeout(()=>{
            dispatch(selectMatch(false))
        },10);

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchDetail);
