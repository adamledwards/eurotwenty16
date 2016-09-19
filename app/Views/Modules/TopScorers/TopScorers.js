'use strict';

import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router';
import classNames from 'classnames';
import TeamColours from '../Styles';
import Modal from '../Modal';
import {StaggeredMotion, spring} from 'react-motion';
import prefix from 'react-prefixr';
import $ from 'jquery';

class TopScorers extends Component {


    constructor (props){
        super(props);
		this.state = {opacity:0, y:10};
		this.getStyles = this.getStyles.bind(this);
        this.toggleTopScorers = this.toggleTopScorers.bind(this);
    }

	getStyles(prevStyles){

		return prevStyles.map((_, i) => {
			 if(i === 0){
				  return {
					  opacity: spring(this.state.opacity),
					  y:spring(this.state.y)
				  }
			  }
			return {
				opacity: spring(prevStyles[i - 1].opacity),
				y:spring(prevStyles[i - 1].y)
			}
		})
	}

	componentDidMount(){
        this.$els = $(this.refs.element).find('.js-slide');

		this.$els.next().slideToggle(0,function() {
			$(this).removeClass('toggle-active');
		});
		var self = this;
		this.$els.on('click',function() {


        });
    }

    toggleTopScorers(event){
        var $el = $(event.target);
        var topScorersUl = this.refs.topScorersUl;
        var $ul  = $(this.refs.element).find('.TopScorers-list');
        var toogleState;
        if($el.hasClass('arrow-active')){
            $el.removeClass('arrow-active');
            $el.removeClass('toggle-active');
            toogleState = false;
        }else{
            toogleState = true;
            $el.addClass('toggle-active');
            $el.addClass('arrow-active');
        };
        $ul.slideToggle( 300, function() {
            if(toogleState){
                this.setState({opacity:1, y:0});
            }else{
                this.setState({opacity:0, y:10});
            }

        }.bind(this));
    }

	render(){
		const {topScorers} = this.props;
		let scorers = topScorers.slice(0,10);
		return (
            <section className="TopScorers" ref="element">
                <div className="container" onClick={this.toggleTopScorers}>
                    <h2>Top Scorers
					<span className='arrow'>
						<span></span>
						<span></span>
					</span>
					</h2>
                </div>
				<div className="container">

					<StaggeredMotion
					  defaultStyles={scorers.map(t=>({opacity:0, y:10}))}
					  styles={this.getStyles}>
					  {interstyles =>
					  <ul className="TopScorers-list" >
			                {interstyles.map((s, i)=>
			                    <li className="row" key={scorers[i].dbid} style={prefix({opacity:s.opacity, transform:`translateY(${s.y}px)`})}>
									<div className="col-xs-2 col-sm-1 col-sm-offset-2 ">{i+1}</div>
									<div className="col-xs-10 col-sm-8">
										<div className="row">
											<div className="col-xs-14 col-sm-7">
											{scorers[i].name}
											</div>
											<div className="col-xs-14 col-sm-7">
												{scorers[i].teamName}
											</div>
										</div>
									</div>
									<div className="col-xs-2 col-sm-1">{scorers[i].goals}</div>
								</li>
							)}
						</ul>
            			}
					</StaggeredMotion>
				</div>
            </section>
		)
	}
}



export default TopScorers
