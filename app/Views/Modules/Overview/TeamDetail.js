import React, {Component} from 'react';
import {Link} from 'react-router';
import $ from 'jquery';

class View extends Component {


    indexbyId(arr, id) {
        var indx = arr.findIndex((v)=>{
            return id == v.dbid;
        });
        return indx;
    }

    renderPlayers(team, pos){
        if(team.hasOwnProperty('players')){
            return team.players.filter(players => players.position == pos).map(player =>
                <li key={player.dbid}>{player.name}</li>
            )
        }
    }

    componentDidMount(){
        const {isMobile} =  this.props;
        if(!isMobile){
            return;
        }
        var element = this.refs.element;
        this.$els = $(element).find(".js-slide");
        var $els = this.$els;
        this.$els.on('click',function() {
            var $el = $(this);
            var $ul = $el.next();

            $(element).not($el)
                .find(".toggle-active")
                .slideToggle(300,function() {
                    $(this).removeClass('toggle-active');

                });

                $els.not($el).removeClass("arrow-active");
                if($el.hasClass("arrow-active")){
                    $el.removeClass("arrow-active");
                }else{
                    $el.addClass("arrow-active");
                };


            $ul.not('.toggle-active').slideToggle( 300, function() {
                $(this).addClass('toggle-active');
            });

        });
    }

    render() {
        const {teams, userteam, table, onHomeClick} = this.props;

        let i = this.indexbyId(teams, userteam.dbid);
        let team =  teams[i];
        return (
            <div className='container' ref="element">
                <div className='row'>
                    <div className='col-xs-14'>

                    <span className="hide-xs">&nbsp;</span>
                        <h2 className="TeamDetail-header">
                            {team.team}
                            <span className="show-xs"><br/></span>
                            <span className="hide-xs"> &mdash; </span>Group {team.group.toUpperCase()}
                        </h2>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-2 '>
                        <div className='Overview-players'>

                            <h3 className='Overview-players-header js-slide'>Goalkeepers
                            <span className='arrow'>
                                <span></span>
                                <span></span>
                            </span>
                            </h3>
                            <ul>
                              {this.renderPlayers(team, 'GK')}
                            </ul>
                        </div>
                   </div>
                    <div className='col-sm-2'>
                        <div className='Overview-players'>
                              <h3 className='Overview-players-header js-slide'>Defenders
                              <span className='arrow'>
                                  <span></span>
                                  <span></span>
                              </span>
                              </h3>
                              <ul>
                                {this.renderPlayers(team, 'DF')}
                              </ul>
                          </div>
                     </div>
                    <div className='col-sm-2'>
                    <div className='Overview-players'>
                              <h3 className='Overview-players-header js-slide'>Midfielders
                              <span className='arrow'>
                                  <span></span>
                                  <span></span>
                              </span>
                              </h3>
                              <ul>
                              {this.renderPlayers(team, 'MF')}
                            </ul>
                        </div>
                   </div>
                    <div className='col-sm-2'>
                        <div className='Overview-players'>
                              <h3 className="Overview-players-header js-slide">Forwards
                              <span className='arrow'>
                                  <span></span>
                                  <span></span>
                              </span>
                              </h3>
                              <ul>
                              {this.renderPlayers(team, 'FW')}
                             </ul>
                         </div>
                    </div>
                    <div className='col-sm-2'>
                        <div className='Overview-players'>
                            <h3 className="Overview-players-header js-slide">Group {team.group.toUpperCase()}
                            <span className='arrow'>
                                <span></span>
                                <span></span>
                            </span>
                            </h3>
                            <ul>
                              {table.sort((a,b) => (a.position - b.position) ).map((team,i) => {
                                  return (
                                      <li key={team.dbid}>{team.team}</li>
                                  )
                              })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default View;
