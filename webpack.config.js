var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './dev/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'index.js'
  },
  module: {
    loaders: [{
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?presets[]=es2015'
    }, {
      test: /\.styl$/,
      loader: 'css-loader!stylus-loader'
    }, {
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /vux.src.*?js$/,
      loader: 'babel'
    }]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.entry = './src/index.js'

  module.exports.output = {
    path:'./dist',
    filename:'index.js',
    library:'VueEventCalendar',
    libraryTarget: 'umd'
  }
  module.exports.devtool = '#source-map'
  module.exports.module.rules[0].options.loaders = {
    css: ExtractTextPlugin.extract({
      loader: 'css-loader',
      fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
    }),
    less: ExtractTextPlugin.extract({
      loader: 'css-loader!less-loader',
      fallbackLoader: 'vue-style-loader'
    })
  }
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin("style.css")
  ])
}
