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
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.js$/
          },
          {
            test: /\.json$/,
            loader: "json-loader"
          }
        ],
      }
    },
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
