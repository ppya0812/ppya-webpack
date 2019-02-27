const loaderUtils = require('loader-utils')

function loader (source) {
  // file-loader需要返回一个路径
  // stringifyRequest 将绝对路径转化为相对路径
  let filename = loaderUtils.interpolateName(this, 'main.[hash:5].[ext]', {
    content: source
  })
  // emitFile 产生一个文件
  this.emitFile(filename, source)
  return `module.exports=${source}`
}
loader.raw = true // 二进制

module.exports = loader
