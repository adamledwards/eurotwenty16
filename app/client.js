'use strict';


import React from 'react'
import ReactDOM from 'react-dom'
import { match, Router, browserHistory } from 'react-router';
import routes from './Routes'
import { createStore, applyMiddleware} from 'redux'
import { teams } from './Reducers/teams.js';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import { modalOpen, selectMatch, fetchMatch, selectTeam, fetchTeam } from './Actions/teams.js';


const loggerMiddleware = createLogger();
// Grab the state from a global injected into server-generated HTML

const initialState = Immutable.Map(window.__INITIAL_STATE__)
// Create Redux store with initial state
const store = createStore(
  teams,
  initialState,
  applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
    //loggerMiddleware // neat middleware that logs actions
  )
);

browserHistory.listen(location => {
    if(location.pathname.indexOf('/menu') > -1){
        store.dispatch(modalOpen());
    }
    if(location.pathname.indexOf('/match') > -1){
        var dbid = location.pathname.match(/[0-9]+/g);
        if(dbid.length){
            store.dispatch(selectMatch(dbid));
        }
    }


})


const mountApp = function () {
    match({ history:browserHistory, routes }, (error, redirectLocation, renderProps) => {
        ReactDOM.render(
            <Provider store={store}>
                <Router {...renderProps} />
            </Provider>
        ,document.getElementById('root') );
    })
}

if(document.readyState !== "loading") {
    mountApp();
} else {
    document.addEventListener('DOMContentLoaded', function(event) {
        mountApp();
    });
}

//Service Worker
