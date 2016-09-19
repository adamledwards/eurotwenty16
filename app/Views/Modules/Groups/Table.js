'use strict';

import React, { PropTypes, Component} from 'react'
import classNames from 'classnames';
import $ from 'jquery';

class Table extends Component {

   teamInGroup() {
	   const {table, userteam} = this.props;

		if(!userteam){
			return false;
		}

		/*
		matches.map(function(match){
		return match.dbid;
		});*/
		var dbids = table.map(team => team.dbid);
		return dbids.indexOf(userteam.dbid) !== -1;
	}

    componentDidMount(){
        const {isMobile} =  this.props;
        if(!isMobile){
            return;
        }
        var element = this.refs.element;
        this.$els = $(element);

        this.$els.on('click','.js-slide',function() {

                $(element).not(this).parent().find(".toggle-active")
                    .slideToggle(300,function() {
                        $(this).removeClass('toggle-active');
                    });

                    var $table = $(this).parent('.Table');
                    $('.Table').not($table).removeClass("Table--selected");

                    if($table.hasClass("Table--selected")){
                        $table.removeClass("Table--selected");
                    }else{
                        $table.addClass("Table--selected");
                    };

                    $(this).next().not('.toggle-active').slideToggle( 300, function() {

                        $(this).addClass('toggle-active');
                    });

        });

    }

    componentDidUpdate(){
        const {isMobile} =  this.props;
        if(!isMobile){
            return;
        }

        var element = this.refs.element;
        console.log(element);
        this.$els = $(element);

        if(!this.teamInGroup()) {
            $(element).removeClass("Table--selected")
                .find('.Table-wrapper')
                .not('.toggle-activeStartap')
                .removeClass('toggle-active')
                .attr('style', '');
        }


        this.$els.find('.toggle-activeStartap')
            .not('toggle-active')
            .slideToggle( 0, function() {
                $(this).addClass('toggle-active');
            });

    }

	render() {
		const {table, group} =  this.props;
        let cn = classNames({
            'Table': true,
            'Table--selected': this.teamInGroup()
        });
        let cn1 = classNames({
            'Table-wrapper':true,
            'toggle-activeStartap': this.teamInGroup()
        });
		return (
			<div className={cn} ref="element" >
				<h3 className="js-slide">Group {group.toUpperCase()}
                <span className='arrow'>
                    <span></span>
                    <span></span>
                </span>
                </h3>
                <div className={cn1} style={{}}>
    				<table className="Table-group">
    					<thead>
    						<tr>
    							<td className="group-team"></td>
    							<td className="group-plays">PL</td>
    							<td className="group-gd">GD</td>
    							<td className="group-pts">Pts</td>
    						</tr>
    					</thead>
    					<tbody>
    					{
    						table.sort((a,b) => (a.position - b.position) ).map((team,i) => {
    							return (
    								<tr key={team.dbid}>
    									<td className="group-team">{i+1}. {team.team}</td>
    									<td className="group-plays">{team.gamesPlayed}</td>
    									<td className="group-gd">{team.goalDiff}</td>
    									<td className="group-pts">{team.points}</td>
    								</tr>
    							)
    				  		} )
    			  		}
    					</tbody>
    				</table>
                </div>
			</div>
		)

	}
}
Table.propTypes = {
  table: PropTypes.array.isRequired,
}


export default Table
