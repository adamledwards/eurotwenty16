import React, {Component} from 'react';
import { Router, Link } from 'react-router';
import { connect } from 'react-redux'
import Modal from './Modal'
import { modalOpen, modalClose } from 'Actions/teams.js';

const mapStateToProps = (state) => {
  return {
    userteam: state.get('user:team'),
    hover: state.get('user:hover:team'),
    modal: state.get('app:modal')
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
      modalClose: () => {
          dispatch(modalClose());
      },
      modalOpen: () => {
          dispatch(modalOpen());
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
