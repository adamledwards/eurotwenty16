import React, {Component} from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import TeamColours from '../Styles';

class View extends Component {

    componentWillUnmount() {
        this.props.modalClose();
    }


    render() {
        const { modal, userteam, hover } = this.props;
        let teamStyles ={};

        if(userteam){
            teamStyles.backgroundColor = TeamColours[userteam.name].primaryColour;
            teamStyles.color = TeamColours[userteam.name].textcolour;
        }
        if(hover){
            teamStyles.backgroundColor = TeamColours[hover.name].primaryColour;
            teamStyles.color = TeamColours[hover.name].textcolour;
        }


        return (
             <section className="Modal">
                 <div className="Modal-container"  style={teamStyles}>
                     <div className="Modal-content">
                         {this.props.children}
                     </div>
                 </div>
             </section>
        )
    }
};

export default View;
