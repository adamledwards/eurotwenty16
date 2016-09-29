import React, {Component} from 'react';
import { Router, Link } from 'react-router';
import { connect } from 'react-redux'
import TopScorers from './TopScorers'


const mapStateToProps = (state) => {
    return {
        topScorers: state.get('app:topScorers')
    }
}


export default connect(mapStateToProps)(TopScorers)
