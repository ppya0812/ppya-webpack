class FileListPlugin {
  constructor () {
    this.filename = 'fileList.md'
  }
  apply (compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
      // assets输出的静态资源
      const assets = compilation.assets
      let content = '## 文件名              资源大小 \n'
      Object.entries(assets).forEach(([filename, statObj]) => {
        console.log(filename, statObj.size())
        content += `-  ${filename}      ${statObj.size()} \n`
      })
      assets[this.filename] = {
        source () {
          return content
        },
        size () {
          return content.length
        }
      }
      cb()
    })
  }
}

module.exports = FileListPlugin
