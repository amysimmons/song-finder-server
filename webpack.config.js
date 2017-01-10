var path = require('path');
var webpack = require('webpack');


module.exports = {
  devtool: 'eval',

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    './scripts/main.js'
  ],

  output: {
    path: path.resolve('build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?presets[]=es2015&presets[]=react'],
        include: [path.resolve('scripts')]
      }
    ]
  },

  stats: {
    colors: true
  },

  devServer: {
    stats: {
      chunkModules: false,
      colors: true
    }
  }
};