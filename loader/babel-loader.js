let babel = require('@babel/core')
let loaderUtils = require('loader-utils')

function loader (source) {
  const options = loaderUtils.getOptions(this)
  let cb = this.async()
  const sourcePath = this.resourcePath
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: sourcePath.split('/').pop() // 文件名
  }, function (err, result) {
    cb(err, result.code, result.map) // 异步
  })
}

module.exports = loader
