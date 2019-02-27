let loaderUtils = require('loader-utils')
let validateOptions = require('schema-utils')

//  loader 选项，进行与 JSON Schema 结构一致的校验
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  },
  additionalProperties: false
}

function loader (source) {
  const options = loaderUtils.getOptions(this)
  validateOptions(schema, options, 'Example Loader')
  console.log(`export default ${JSON.stringify(source)}`)
  return `export default ${JSON.stringify(source)}`
}

module.exports = loader
