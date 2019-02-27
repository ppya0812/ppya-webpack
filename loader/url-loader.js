const loaderUtils = require('loader-utils')
const mime = require('mime')

function loader (source) {
  let options = loaderUtils.getOptions(this)
  if (options && options.limit && options.limit > source.length) {
    return `module.exports = "data:${mime.getType(this.sourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('./file-loader').call(this, source)
  }
}
loader.raw = true // 二进制

module.exports = loader
