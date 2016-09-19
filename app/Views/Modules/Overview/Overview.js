import React, {Component} from 'react';
import { Router, Link } from 'react-router';
import TeamColours from '../Styles'
import TeamDetail from './TeamDetail'
import classNames from 'classnames';

class View extends Component {

    render() {

        const { onClick, userteam, groups, teams, onHomeClick, isMobile} = this.props;
        let cn = classNames({
            'Overview': true,
            'Overview--teamSelected': userteam
         });
        var teamStyles = {};
        var overview;
        if(userteam){
            teamStyles.backgroundColor = TeamColours[userteam.name].primaryColour;
            teamStyles.color = TeamColours[userteam.name].textcolour;

            overview = <TeamDetail isMobile={isMobile} userteam={userteam} onHomeClick={onHomeClick} teams={teams} table={groups[userteam.group]}/>
        } else {
            overview = (
                <div className="Top container">
                    <h1>2016 UEFA European
                    <span className="show-xs"><br/></span>
                    <span className="hide-xs">&nbsp;</span>
                    Championship France,
                    <span className="hide-sm"><br/></span>
                    <span className="hide-xs">&nbsp;</span>
                    10 June — 10 July 2016
                    </h1>
                    <Link className="btn" to={{pathname:'/menu/select-team' }}>Select a Team</Link>
                </div>
            )
        }
        return (
            <header className={cn} style={teamStyles}>
                {overview}
            </header>
        )
    }
};
export default View;
