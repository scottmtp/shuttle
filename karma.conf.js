var webpack = require('webpack');

module.exports = function (config) {
  'use strict';
  config.set({
    browsers: [ 'Chrome' ],
    files: [
      'tests.webpack.js'
    ],
    frameworks: [ 'chai', 'mocha' ],
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage'
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap', 'coverage' ]
    },
    reporters: [ 'dots', 'coverage' ],
    singleRun: true,
    webpack: {
      devtool: 'inline-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': '"production"',
            'API_URL': '"https://www.tryshuttle.com"'
          }
        }),
        new webpack.optimize.DedupePlugin()
      ],
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.js$/
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ],
      }
    },
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
