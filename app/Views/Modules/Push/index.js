'use strict';

import React from 'react';
import Push from './Push';
import { connect } from 'react-redux'
import { subscribeUser, unsubscribeUser} from 'Actions/teams.js';

const mapStateToProps = (state) => {
  return {
    usersubscribe: state.get('user:subscribe')
  }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        subscribeUser: (endpoint) => {
    		dispatch(subscribeUser(endpoint));
        },
        unsubscribeUser: (endpoint) => {
            dispatch(unsubscribeUser(endpoint));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Push);
