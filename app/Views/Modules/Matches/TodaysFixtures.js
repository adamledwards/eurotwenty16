import React from 'react';
import { Link } from 'react-router';
import Match from './Match';

const TodaysFixtures = ({calendar, moment}) => {
    var today = new Date();

    var now = today.getTime();

     today.setUTCHours(0,0,0,0);
     let day = today.getTime();
    if (day.toString() in calendar){
        let matches = calendar[day];
        if(matches.length === 0){
            return (<span></span>)
        }
    	return (
    		<section className="TodaysFixtures TodaysFixtures-top" >
    		 	<div className="container">
                    <h2>Todays Fixtures</h2>
                    <div className="TodaysFixtures-flex" >
                        {matches.map((match,i) => {
                            return (
                                <Match
                                key={match.dbid}
                                match = {match}
                                moment = {moment}
                                isPlaying = {false}
                                index={i}
                                />
                            )
                        })}
                    </div>
    			</div>
    		</section>
    	)
    }else{
        return (<span></span>)
    }
}

export default TodaysFixtures
