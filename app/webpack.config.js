'use strict';
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');

module.exports = [{

  entry: ['babel-polyfill', __dirname + '/client.js'],

  output: {
    path: __dirname + '/static',
    filename: 'bundle.js'
  },
  plugins: [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
    ],
  //devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
    }
    ]
  },
  resolve: {
     root: path.resolve(__dirname),
     alias: { rediscrowdscores: "../ajaxcrowdscores.js" },
     extensions: ['', '.js', '.jsx', '.json']
    },
},
{

  entry: __dirname + '/rediscrowdscores.js',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
 externals: [nodeExternals()], // in order to ignore all modules in node_modules folde
  output: {
    path: __dirname + '/../task/',
    filename: 'rediscrowdscores.js',
    libraryTarget: "commonjs2",
    library: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
},
{
  entry: __dirname + '/ajax.worker.js',
  output: {
    path: __dirname + '/static',
    filename: 'worker.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
];
