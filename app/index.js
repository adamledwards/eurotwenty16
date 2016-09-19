'use strict';
require('babel-register')({
  presets: ['es2015', 'react'],
  resolveModuleSource: require('babel-resolver')(__dirname)
});
global.Promise = require('bluebird');
require('./server');
