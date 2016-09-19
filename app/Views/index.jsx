'use strict';

var React = require('react');
import NavBar from './Modules/NavBar';

module.exports = class View extends React.Component {

  render() {
    return (
        <div id="app">
        <NavBar />
        {this.props.children}
        </div>
    );
  }
};
