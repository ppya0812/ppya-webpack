const path = require('path')
// const webpack = require('webpack')
class P {
  apply (compiler) {
    compiler.hooks.emit.tap('emit', () => {
      console.log('emit PPPPPPP')
    })
  }
}

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, '../loader', 'style-loader'),
          path.resolve(__dirname, '../loader', 'less-loader')
        ]
      }
    ]
  },
  plugins: [
    new P()
  ]
}
