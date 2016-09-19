import React, {Component} from 'react';
import { Router, Link } from 'react-router';
import { selectTeam, selectMatch } from 'Actions/teams.js';
import { connect } from 'react-redux';
import NavBar from './NavBar';


const mapStateToProps = (state) => {
    return {
        userteam: state.get('user:team'),
        hover: state.get('user:hover:team'),
    	modal: state.get('app:modal')
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onHomeClick: () => {
    		dispatch(selectTeam(false));
            dispatch(selectMatch(false));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
