const path = require('path')
// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DonePlugin = require('./plugin/DonePlugin')
const AsyncPlugin = require('./plugin/AsyncPlugin')
const FileListPlugin = require('./plugin/FileListPlugin')
const InlineSourcePlugin = require('./plugin/InlineSourcePlugin')
module.exports = {
  entry: './loader/a.js',
  resolveLoader: {
    modules: [
      path.resolve(__dirname, '../loader')
    ]
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        // loader: require.resolve('./loader/babel-loader')
        use: [
          {
            loader: require.resolve('./loader/url-loader')
            // options: {
            //   limit: 1024
            // }
          }
          // {
          //   loader: require.resolve('./loader/banner-loader'),
          //   options: {
          //     text: 'haha',
          //     filename: path.resolve('./loader/a.js')
          //   }
          // }
          // {
          //   loader: require.resolve('./loader/schema-loader'),
          //   options: {
          //     name: 'haha'
          //   }
          // }
          // {
          //   loader: require.resolve('./loader/babel-loader'),
          //   options: {
          //     // presets: ['@babel/preset-env']
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
    new DonePlugin(),
    new AsyncPlugin(),
    new FileListPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunks: 'main'
    }),
    new InlineSourcePlugin({
      match: '/.(js|css)$/'
    })
  ]
}
