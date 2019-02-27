const HtmlWebpackPlugin = require('html-webpack-plugin')

class InlineSourcePlugin {
  constructor ({ match }) {
    this.reg = match
  }
  processTag (tag, compilation) { // 处理某一标签
    let newTag
    let url
    if (tag.tagName === 'link' && this.reg.test(tag.attributes.href)) {
      newTag = {
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      }
      url = tag.attributes.href
    }
    if (tag.tagName === 'script' && this.reg.test(tag.attributes.src)) {
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascript'
        }
      }
      url = tag.attributes.src
    }
    if (url) {
      newTag.innerHTML = compilation.assets[url].source() // 文件的内容放到innerHTML属性上
      delete compilation.assets[url] // 删除掉原有应该生成的资源
      return newTag
    }
    return tag
  }
  processTags (data, compilation) { // 处理引入标签的数据
    console.log(data)
    let headTags = []
    let bodyTags = []
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag, compilation))
    })
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation))
    })
    return { ...data, headTags, bodyTags }
  }
  apply (compiler) {
    compiler.hooks.compilation.tap('InlineSourcePlugin', compilation => {
      // alterAssetTagGroups alterAssetTags
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterPlugin', (htmlPluginData, cb) => {
        // htmlPluginData.assetTags
        htmlPluginData = this.processTags(htmlPluginData, compilation)
        cb(null, htmlPluginData)
      })
    })
  }
}

module.exports = InlineSourcePlugin
