import React, {Component} from 'react';
import {Link} from 'react-router';
import ReactDOM from 'react-dom';
import Scroll from 'react-scroll';
import classNames from 'classnames';
import TeamLineUp from './TeamLineUp';
import TeamColours from '../Styles'
import States from './States';
import Infographic from './Infographic';
import moment from 'moment';
import $ from 'jquery';
import prefix from 'react-prefixr';

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {animationDone:false};
    }


    indexbyId(arr, id) {
        var indx = arr.findIndex((v)=>{
            return id == v.dbid;
        });
        return indx;
    }

    fetchMatchIfNeeded(id) {
        const {matches, isMobile, fetchMatch} = this.props;
        let i = this.indexbyId(matches, id);
        let match = matches[i]
        if(!match.hasOwnProperty('players') && !isMobile){
            fetchMatch(id);
        }
    }

    componentDidMount() {
        const {styles,usermatch, params, parentRef, matches} = this.props;
        //Caching should be here
        var rect;
        var mbcOffsetHeight = this.refs.mbc.offsetHeight

        $('.js-slideDown').css(prefix({transform:`translateY(${mbcOffsetHeight}px)`}))
        $(parentRef).parents('.calendar-row')
            .css(prefix({transform:`translateY(0px)`}))
            .attr('data-top', 0);

        $(parentRef).parent().parent().parent()
            .prevAll('.calendar-row')
            .css(prefix({transform:`translateY(0px)`}))
            .attr('data-top', 0);

        $(parentRef).parent().parent().parent()
            .nextAll('.calendar-row')
            .css(prefix({transform:`translateY(${mbcOffsetHeight}px)`}))
            .attr('data-top', mbcOffsetHeight);

        setTimeout(function(){
            this.setState({animationDone:true});
            rect = this.refs.mb.getBoundingClientRect();
            Scroll.animateScroll.scrollTo(rect.top + document.body.scrollTop-100);
        }.bind(this),300)
        this.fetchMatchIfNeeded(params.mdbid);
    }

    componentDidUpdate() {
        const {parentRef, usermatch} = this.props;
        if(!usermatch) {
            $('.js-slideDown').css(prefix({transform:'translateY(0px)'}));
            $('.calendar-row').css(prefix({transform:'translateY(0px)'}))
            .attr('data-top', 0);
            return
        }

        var mbcOffsetHeight = this.refs.mbc.offsetHeight;
        $('.js-slideDown').css(prefix({transform:`translateY(${mbcOffsetHeight}px)`}))
        $(parentRef).parents('.calendar-row')
            .css(prefix({transform:`translateY(0px)`}))
            .attr('data-top', 0);

        $(parentRef).parent().parent().parent()
            .prevAll('.calendar-row')
            .css(prefix({transform:`translateY(0px)`}))
            .attr('data-top', 0);

        $(parentRef).parent().parent().parent()
            .nextAll('.calendar-row')
            .css(prefix({transform:`translateY(${mbcOffsetHeight}px)`}))
            .attr('data-top', mbcOffsetHeight);

        this.sortGoalEvents()
    }

    componentWillReceiveProps(nextProps) {
        const {styles, usermatch, params} = nextProps;
        if(params.mdbid !== this.props.params.mdbid ){
            this.fetchMatchIfNeeded(params.mdbid);
        }
    }

    renderPlayers(match) {
        if(match.hasOwnProperty('players')){
            return (
                <div className="col-sm-7">
                    <div className="row">
                        <div className="col-xs-7"><TeamLineUp  animationDone={this.state.animationDone} key='TeamLineUpHome' name={match.homeTeam} players={match.players.homeTeam} lineup={match.players.lineup} substitutions={this.substitutions().H} cards={this.cards().H}/> </div>
                        <div className="col-xs-7"><TeamLineUp animationDone={this.state.animationDone} key='TeamLineUpAway' name={match.awayTeam} players={match.players.awayTeam}  lineup={match.players.lineup} substitutions={this.substitutions().A} cards={this.cards().A}/></div>
                    </div>
                </div>
            )
        }
    }


    getState(match, state) {

        let timestamp = parseInt(match.start);
        let today = new Date();
        let now = today.getTime();

        if(today > timestamp && match.currentState !== "0"){
            return state.longName;
        }else {
            return `Kick off - ${moment(timestamp).format("HH:mm")}`;
        }
    }

    renderMobile() {
        const {calendar, usermatch} = this.props;
        if(!calendar) {
            return (<span></span>)
        }
        let timestamp = parseInt(this.match.start);
        let d = new Date(timestamp).setUTCHours(0,0,0,0);
        return (
            <div className="row">
                <div className="col-xs-14 ">
                    <div className="TodaysFixtures">
                    {calendar[d].map(match=> {
                        let state = States[match.currentState]
                        return (
                            <div key={match.dbid} className="MatchItem MatchDetail-item">
                				<span className="MatchItem-copy">
                					<span className="MatchItem-game">
                			        	{match.homeTeam} {state.hasScore ? match.homeGoals: null} {state.hasScore ? "\u2014": "vs"} {state.hasScore ? match.awayGoals: null} {match.awayTeam}
                					</span>
                                    {this.renderPenaltyShootout(match)}
                					<span className="MatchItem-start">
                						{this.getState(match, state)}
                					</span>
                					<span className="MatchItem-start">
                						{match.stadium}
                					</span>
                				</span>
                			</div>
                        )
                    }
                )}
                </div>
            </div>
        </div>
        )
    }

    sortGoalEvents() {

        var data ={
            H:{
                ids:[],
                data:{}
            },
            A:{
                ids:[],
                data:{}
            }
        }
        if(!this.match.matchevents){
            return data;
        }
        var events = this.match.matchevents.filter((match)=>{
            if(match.type == "goal"){
                return true
            }
        }).sort((a, b) => {
            return a.happenedAt - b.happenedAt;
        });

        events.forEach((event)=>{
            let dbid = event.scoringPlayer.dbid;
            let side = event.scoringSide;
            if(!data[side].data.hasOwnProperty(dbid)){
                data[side].ids.push(dbid);
                data[side].data[dbid] = {
                    happenedAt: event.happenedAt,
                    matchTimeStrings:[event.matchTimeString],
                    ownGoal: event.ownGoal,
                    ownGoal: event.penalty
                }

            }else{
                data[side].data[dbid].matchTimeStrings.push(event.matchTimeString)
            }

        });
        return data;
    }

    substitutions() {
        var data ={
            H:{
                data:{}
            },
            A:{
                data:{}
            }
        }
        if(!this.match.matchevents){
            return data
        }
        var events = this.match.matchevents.filter((match)=>{
            if(match.type == "substitution"){
                return true
            }
        }).sort((a, b) => {
            return a.happenedAt - b.happenedAt;
        });


        events.forEach((event)=>{
            let dbid = event.playerOff.dbid;
            let side = event.side;
            data[side].data[dbid] = {};
            data[side].data[dbid].playerOn = event.playerOn;
            data[side].data[dbid].matchTimeString = event.matchTimeString;

        });
        return data;
    }

    cards() {
        var data ={
            H:{
                yellow:0,
                red:0,
                data:{}
            },
            A:{
                yellow:0,
                red:0,
                data:{}
            }
        }
        if(!this.match.matchevents){
            return data
        }
        var events = this.match.matchevents.filter((match)=>{
            if(match.type == "card"){
                return true
            }
        }).sort((a, b) => {
            return a.happenedAt - b.happenedAt;
        });

        events.forEach((event)=>{
            let dbid = event.player.dbid;
            let side = event.side;
            data[side].data[dbid] = {};
            data[side].data[dbid].cardType = event.cardType;
            data[side].data[dbid].matchTimeString = event.matchTimeString;
            if(event.cardType == 'first-yellow'){
                    data[side].yellow++;
            }else if(event.cardType == 'second-yellow'){
                data[side].yellow++;
                data[side].red++;
            }else {
                data[side].red++;
            }
        });

        return data;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.usermatch !== undefined ;
    }

    renderPenaltyShootout(matchItem = false) {
         var penaltyShootout = false;
         var match;

         if(matchItem){
             match = matchItem;
         }else{
             match = this.match;
         }
        if(match.penaltyShootout != null){
            penaltyShootout = JSON.parse(match.penaltyShootout);
        }else{
            return
        }

        if(!penaltyShootout){
            return undefined;
        }

        var winner = function(){

            if(penaltyShootout.score.home>penaltyShootout.score.away){
                    return match.homeTeam+' win '+penaltyShootout.score.home+' \u2014 '+penaltyShootout.score.away;
            } else {
                return match.awayTeam+' win '+penaltyShootout.score.away+' \u2014 '+penaltyShootout.score.home;
            }
        }.bind(this);

        if(match.currentState == "9"){
            return <span className="MatchDetail-penalty">{winner()} on penalties</span>;

        }else{
            return <span className="MatchDetail-penalty">{match.homeTeam+' '+penaltyShootout.score.home+' - '+penaltyShootout.score.away+' '+match.awayTeam}</span>;
        }


    }

    renderDesktop() {
        let playersElement = this.renderPlayers(this.match);

        this.renderPenaltyShootout();
        return (
            <div>
                <div className="row">
                    <div className="col-sm-7 ">
                        <div className="MatchDetail-scoreboard">
                            <h3 className="MatchDetail-score">
                            <span>{this.match.homeTeam} {this.matchState.hasScore ? this.match.homeGoals: null}</span>
                            <span> {this.matchState.hasScore ? "\u2014": "vs"} </span>
                            <span>{this.matchState.hasScore ? this.match.awayGoals: null} {this.match.awayTeam}</span>
                            </h3>
                            {this.renderPenaltyShootout()}
                            <h4 className="MatchDetail-stadium">{this.match.stadium}</h4>
                            <h4 className="MatchDetail-stadium">{this.getState(this.match, this.matchState)}</h4>
                            <ul className="MatchDetail-legend">
                                <li>*<br/>Yellow card</li>
                                <li>**<br/>Second booking</li>
                                <li>***<br/>Red card</li>
                            </ul>
                        </div>
                    </div>
                    {playersElement}
                </div>
                <Infographic match={this.match} cards={this.cards()}/ >
            </div>
        )
    }

    render() {

        const {usermatch, stadium, styles, matches, userteam, isMobile, clearMatch, CN} = this.props;
        var mapsStyes ={};
        var teamStyes ={};
        if(styles){
            mapsStyes = {top:styles.top}
        }
        if(!usermatch) {
            return (<span></span>)
        }
        let i = this.indexbyId(matches, usermatch.dbid);
        this.match =  matches[i];
        this.matchState = States[this.match.currentState];

        if(userteam){
            teamStyes.color = TeamColours[userteam.name].calendar || '#FFFFFF';
            teamStyes.backgroundColor = TeamColours[userteam.name].textcalendar || TeamColours[userteam.name].primaryColour;
        }

        let cn = classNames({
            'MatchDetail': true,
            'MatchDetail--interactive': styles
         });
        let element;
        if(isMobile){
            element = this.renderMobile();
        } else {
            element = this.renderDesktop();
        }
        return (
            <section className={cn+' '+CN} style={prefix({transform:`translateY(${styles.top}px)`})} ref="mb">
                <div className="MatchDetail-padding" ref="mbc" style={{backgroundColor:teamStyes.color}}>
                    <div className="MatchDetail-wrapper" style={teamStyes}>
                        <div className="container MatchDetail-container" >
                            <Link to={"/"} onClick={clearMatch} className="MatchDetail-close">
                                <span></span>
                                <span></span>
                            </Link>
                            {element}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
export default View;
