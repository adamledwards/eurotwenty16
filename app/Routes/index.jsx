'use strict';

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from 'Views';
import Modules from '../Views/Modules';
import Nav from 'Views/Modules/Nav';
import Modal from 'Views/Modules/Modal';
import TeamSelection from 'Views/Modules/TeamSelection';
import MatchDetail from 'Views/Modules/MatchDetail';
import Push from 'Views/Modules/Push';



module.exports = (
    <Router history={browserHistory}  component={App}>
        <Route path='/' component={Modules} >
            <Route path='/menu' component={Modal} >
                <IndexRoute component={Nav}/>
                <Route path='select-team' component={TeamSelection}/>
                <Route path='push' component={Push}/>
            </Route>
            <Route path='/match/:mdbid' component={MatchDetail} />
        </Route>
    </Router>
);
