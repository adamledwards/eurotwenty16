import React, { PropTypes, Component } from 'react'
import Calendar from './Calendar'
import TodaysFixtures from './TodaysFixtures'
import TeamColours from '../Styles'
import classNames from 'classnames';
import { TransitionMotion, spring } from 'react-motion';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDOM from 'react-dom';
import $ from 'jquery';


class MatchList extends Component  {

    constructor (props){
        super(props)
        this.componentMounted = false;
    }

    findIndex(matches, id){
        return matches.findIndex((v)=>{
            return id === v.dbid;
        });
    }

    componentDidMount(){
        this.setTop();
        window.addEventListener("resize", this.setTop.bind(this));
    }

   setTop(){
       var styles = {}
       var offsetHeight = 0;
       var domOffsetHeight = 0;
       var MatchListOffsetHeight = $(".MatchList").offset().top;
       Object.keys(this.refs).forEach((ref)=>{
           let dom = ReactDOM.findDOMNode(this.refs[ref]);
           let top = $(dom).parent().parent().parent().attr('data-top') || 0;
           styles[ref] = {};
            domOffsetHeight = dom.offsetHeight
            styles[ref].top = $(dom).offset().top  - MatchListOffsetHeight - top;
            if(domOffsetHeight > offsetHeight){
                offsetHeight = domOffsetHeight;
            };
       });
      this.componentMounted = true;
      this.styles = styles;
      this.setState({styles:styles})

    }


    renderExpandBox(){
        const {params, usermatch, children, moment, calendar} = this.props;
        var day, parentRef, mdate, week,
        styles = styles = {
            top: 0
        },

        child = <span></span>;

        if(usermatch && this.componentMounted){
            mdate = moment(parseInt(usermatch.start))
            day = mdate.format('DM');
            week = mdate.isoWeek();
            //Dont run for server rendering
            parentRef = this.refs['cs-'+week];
            styles = this.styles['cs-'+week];

            child = React.Children.map(children, function (child) {
                return React.cloneElement(child, {
                    parentRef,
                    key: 'calendar-'+week,
                    CN: 'calendar-'+week,
                    styles: styles,
                    calendar: calendar
                })
            });
        }
        return child;
    }

    renderCalendar(){
        const {calendar, moment, userteam,  usermatch } = this.props;
        var prevWeek, cal,
            arr = [],
            index = -1;

        Object.keys(calendar).forEach((day,i) => {
            var week = moment(parseInt(day)).utc().isoWeek();
            cal = (
                <Calendar
                    key={day}
                    timestamp={day}
                    matches = {calendar[day]}
                    moment = {moment}
                    userteam ={userteam}
                    usermatch ={usermatch}
                    />
            )

            if(prevWeek !== week){
                index++;
                arr[index] = [];
                arr[index].push(cal);
            }else{
                arr[index].push(cal)
            }
            prevWeek = week;
        });
        return arr;

    }

    render(){
        const {calendar, moment, userteam, selectMatch, usermatch, params} = this.props;
        let cn = classNames({
            'MatchList': true,
            'MatchList--teamSelected': userteam || usermatch
         });

         var teamStyles = {},
         mdate,week;
         if(userteam){
             teamStyles.backgroundColor = TeamColours[userteam.name].calendar || '';
             teamStyles.color = TeamColours[userteam.name].textcalendar || TeamColours[userteam.name].primaryColour;
         }

         if(usermatch){
             mdate = moment(parseInt(usermatch.start))
             week = mdate.isoWeek();
         }

        return (
            <div>
                <TodaysFixtures calendar={calendar} moment={moment}/>
                <section className="MatchList-container" style={teamStyles}>
                        <header>
                            <div className='container'>
                                <div className="MatchList-header">
                                    <span className="MatchList-title">Fixtures &amp; Results</span>
                                    <span className="MatchList-date">June &mdash; July 2016</span>
                                </div>
                            </div>
                        </header>
                        <section className={cn}>

                                <div className="calendar-row" style={teamStyles}>
                                    <div className='container'>
                                        <div className='flex'>
                                            <span className="MatchList-dayHeader-item">M</span>
                                            <span className="MatchList-dayHeader-item">T</span>
                                            <span className="MatchList-dayHeader-item">W</span>
                                            <span className="MatchList-dayHeader-item">T</span>
                                            <span className="MatchList-dayHeader-item">F</span>
                                            <span className="MatchList-dayHeader-item">S</span>
                                            <span className="MatchList-dayHeader-item">S</span>
                                        </div>
                                    </div>
                                </div>
                                {this.renderCalendar().map((calendarElement,i) => {
                                    return (
                                        <div className={'calendar-row cr-'+i} key={'cr-'+i} style={teamStyles}>
                                            <div className='container'>
                                                <div className='flex'>
                                                    {calendarElement}
                                                    <div className="calendar-spacer"
                                                        ref={'cs-'+(i+23)}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                              } )}
                          <ReactCSSTransitionGroup transitionName="MatchTransition" component="div" transitionEnterTimeout={400} transitionLeaveTimeout={300}>
                            {this.renderExpandBox()}
                          </ReactCSSTransitionGroup>
                        </section>
                </section>
            </div>
        )
    }
}


MatchList.propTypes = {
    calendar: PropTypes.object,
    userteam:PropTypes.object
}

export default MatchList
