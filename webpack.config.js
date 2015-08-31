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
        'NODE_ENV': '"development"',
        'API_URL': '"https://local.tryshuttle.com"'
      }
    }),
    new AppCachePlugin({
      cache: ['bundle.js', 'index.html', 'quill.base.css', 'quill.snow.css'],
      network: ['*']
    }),
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
