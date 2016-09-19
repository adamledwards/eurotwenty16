import React, {Component} from 'react';
import { Router, Link } from 'react-router';
import { connect } from 'react-redux'
import Nav from './Nav'


const mapStateToProps = (state) => {
  return {
    userteam: state.get('user:team'),
    hover: state.get('user:hover:team'),
	modal: state.get('app:modal')
  }
}


export default connect(mapStateToProps)(Nav)
