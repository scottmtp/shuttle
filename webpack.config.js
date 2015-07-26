var webpack = require('webpack');

module.exports = {
  context: __dirname + "/src/js",
  entry: ["webpack/hot/dev-server", "./App.js"],

  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },

  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin(),
  //   new webpack.optimize.DedupePlugin()
  // ],

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  }

}
