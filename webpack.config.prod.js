var webpack = require('webpack');
var AppCachePlugin = require('appcache-webpack-plugin');

module.exports = {
  context: __dirname + "/src/js",
  entry: ["./App.js"],

  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"',
        'API_URL': '"http://10.0.0.2:3000"'
      }
    }),
    new AppCachePlugin({
      cache: ['bundle.js', 'index.html', 'quill.base.css', 'quill.snow.css'],
      network: ['*']
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin()
  ],

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
