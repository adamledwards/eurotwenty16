'use strict';
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');

module.exports = [{
  entry: __dirname + '/push.worker.js',
  output: {
    path: __dirname + '/static',
    filename: 'service-worker.js'
  }
}]
