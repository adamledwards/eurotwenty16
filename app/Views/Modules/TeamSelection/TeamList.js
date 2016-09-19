import React, { PropTypes, Component } from 'react'
import Team from './Team'
import Modal from '../Modal';
import {StaggeredMotion, spring} from 'react-motion';
import prefix from 'react-prefixr';

class TeamList extends Component {

    componentWillUnmount() {
        const {offTeamHover} = this.props;
        offTeamHover();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    getStyles(prevStyles){
        return prevStyles.map((_, i) => {
             if(i === 0){
                  return {
                      opacity: spring(1, {stiffness: 390, damping: 30}),
                      y:spring(0, {stiffness: 390, damping: 30})
                  }
              }
            return {
                opacity: spring(prevStyles[i - 1].opacity, {stiffness: 390, damping: 30}),
                y:spring(prevStyles[i - 1].y, {stiffness: 390, damping: 30})
            }
        });
    }

    render(){
        const {teams, onTeamClick, onTeamHover, offTeamHover} = this.props;
        return (
                <div className="container">
                    <div className="row">
                        <div className="col-sm-7 hide-xs-block">
                            <h2>Select a team</h2>
                        </div>
                        <div className="col-sm-7">
                            <StaggeredMotion
                              defaultStyles={teams.map(t=>({opacity:0, y:10} ))}
                              styles={this.getStyles}>
                              {teamStyles =>
                                  <ul className="TeamList">
                                      {teamStyles.map((s, index) => {
                                         let team = teams[index];
                                         return (<Team
                                           key={team.dbid}
                                           {...team}
                                           onClick={(e) => onTeamClick(e,teams,index)}
                                           onMouseOver={(e) => onTeamHover(e,teams,index)}
                                           onMouseLeave={(e) => offTeamHover()}
                                           style = {prefix({opacity:s.opacity, transform:`translateY(${s.y}px)`})}
                                         />)
                                        })
                                      }
                                  </ul>
                              }
                            </StaggeredMotion>

                        </div>
                    </div>
                </div>
        )
    }
}

TeamList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    dbid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onTeamClick: PropTypes.func.isRequired,
  isModal: React.PropTypes.bool
}

export default TeamList
