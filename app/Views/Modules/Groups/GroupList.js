import React, { PropTypes } from 'react'
import Table  from './Table'
import TeamColours from '../Styles'
import classNames from 'classnames';


const GroupList = ({groups, userteam, isMobile}) => {
    let cn = classNames({
        'GroupList': true,
        'GroupList--teamSelected': userteam

     });
     var teamStyles = {};
     if(userteam){
         teamStyles.backgroundColor = TeamColours[userteam.name].group || TeamColours[userteam.name].primaryColour;
         teamStyles.color = TeamColours[userteam.name].textgroup || TeamColours[userteam.name].textcolour;
     }
    return (
        <section className={cn} style={teamStyles}>
            <div className="container">
            <h2>Group Standings</h2>
            {Object.keys(groups).map((group,i) => {
                return (
                    <Table
                        userteam ={userteam}
                        key={group}
                        group={group}
                        table = {groups[group]}
                        isMobile={isMobile}
                        />
                )
          } )}
            </div>
        </section>
    )
}


GroupList.propTypes = {
    groups: PropTypes.object
}

export default GroupList
