// import path from 'path'
const fs = require('fs')
const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')

//  loader 选项，进行与 JSON Schema 结构一致的校验
const schema = {
  type: 'object',
  properties: {
    text: {
      type: 'string'
    },
    filename: {
      type: 'string'
    }
  },
  additionalProperties: false
}

function bannerLoader (source) {
  const cb = this.async()
  const options = loaderUtils.getOptions(this)
  validateOptions(schema, options, 'banner-loader')
  if (options.filename) {
    // 【addDependency】： 如果一个 loader 使用外部资源（例如，从文件系统读取），必须声明它。这些信息用于使缓存 loaders 无效，以及在观察模式(watch mode)下重编译。
    this.addDependency(options.filename)
    fs.readFile(options.filename, 'utf-8', function (err, data) {
      cb(err, `/**${data}**/${source}`)
    })
  } else {
    cb(null, `/**${options.text}**/${source}`)
  }
}

module.exports = bannerLoader
