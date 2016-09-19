'use strict';

import React from 'react';
import GroupList from './GroupList'
import { connect } from 'react-redux'



const mapStateToProps = (state) => {
  return {
    groups: state.get('app:groups'),
    userteam: state.get('user:team'),
    isMobile: state.get('app:isMobile')
  }
}

export default connect(mapStateToProps)(GroupList);
