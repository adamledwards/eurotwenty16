'use strict';

import React, {Component} from 'react';
import Overview from './Overview';
import Matches from './Matches';
import Groups from './Groups';
import ModalTransition from './Modal/ModalTransition';
import classNames from 'classnames';
import {selectMatch} from '../../Actions/teams.js'
import { connect } from 'react-redux'
import TopScorers  from './TopScorers';
import TeamColours from './Styles'

const mapStateToProps = (state) => {
  return {
	modal: state.get('app:modal'),
    userteam: state.get('user:team')
  }
}

class Body extends Component {

    render() {
        const { modal, params, userteam } = this.props;
        let cn = classNames({
            'body': true,
            'AppState-Modalactive': modal
        });
        var teamStyles = {
            backgroundColor: "#FFFFFF"
        }
        if(userteam){
            teamStyles.backgroundColor = TeamColours[userteam.name].calendar;
        }
        var children,
            modalChildren,
            matchChildren,
            teamChildren;

        if (modal) {
            modalChildren = this.props.children;
        }else if(params.hasOwnProperty('mdbid')){
            matchChildren =  this.props.children;
        }else if(params.hasOwnProperty('tdbid')){
            teamChildren =  this.props.children;
        }

        return (
            <div>
                <ModalTransition>
                    {modalChildren}
                </ModalTransition>
                <div className={cn} style={teamStyles}>
                    <Overview>
                        {teamChildren}
                    </Overview>
                    <Matches params={this.props.params}>
                        {matchChildren}
                    </Matches>
                    <div className='js-slideDown'>
                        <Groups />
                        <TopScorers />
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps)(Body);
