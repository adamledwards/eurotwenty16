import React, {Component} from 'react';
import { Link, withRouter } from 'react-router';
import TeamColours from '../Styles';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class View extends Component {

    render() {

        return (
            <ReactCSSTransitionGroup transitionName="ModalTransition"  component="div" transitionEnterTimeout={550} transitionLeaveTimeout={350}>
             {this.props.children}
             </ReactCSSTransitionGroup>
        )
    }
};

export default View;
