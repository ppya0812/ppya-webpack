const path = require('path')
const fs = require('fs')
let babylon = require('babylon') // 把源码转成ast
let t = require('@babel/types')
let traverse = require('@babel/traverse').default // 遍历ast
let generator = require('@babel/generator').default // 根据ast生成代码
const ejs = require('ejs')
let { SyncHook, SyncBailHook, SyncWaterfallHook, AsyncParallelHook } = require('tapable')

// https://astexplorer.net/

class Compiler {
  constructor (config) {
    // entry output
    this.config = config
    // 需要保存入口文件路径
    this.entryId = '' // './src/index.js'
    // 需要保存所有模块依赖
    this.modules = {}
    this.entry = config.entry // 入口路径
    this.root = process.cwd() // 工作路径
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    // 处理plugin
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }

  getSource (modulePath) {
    const rules = this.config.module.rules
    let content = fs.readFileSync(modulePath, 'utf8')
    // 拿到每个规则来处理
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let { test, use } = rule
      let len = use.length - 1
      if (test.test(modulePath)) {
        // loader获取对应的loader函数
        const normalLoader = () => {
          let loader = require(use[len--])
          content = loader(content)
          if (len >= 0) {
            normalLoader()
          }
        }
        normalLoader()
      }
    }
    return content
  }
  parse (source, parentPath) {
    // AST 解析语法树
    let ast = babylon.parse(source)
    let dependencies = [] // 依赖数组
    traverse(ast, {
      CallExpression (p) {
        let node = p.node // 对应的节点
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value // 取到的就是模块的引用名字
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js') // src/a.js
          moduleName = './' + path.join(parentPath, moduleName)
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      }
    })
    let sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }
  // 创建模块
  buildModule (modulePath, isEntry) {
    // 拿到模块内容
    const source = this.getSource(modulePath)
    // 模块id  modulePath = module - this.root src/index.js
    const moduleName = './' + path.relative(this.root, modulePath) // 模块名称 "./src/a.js"
    if (isEntry) {
      this.entryId = moduleName // 保存入口名字
    }

    // 解析需要把source源码进行改造，返回一个依赖列表
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    // 把相对路径和模块中的内容对应起来
    this.modules[moduleName] = sourceCode

    dependencies.forEach(dep => { // 附加模块的加载，递归加载
      this.buildModule(path.join(this.root, dep), false)
    })
  }

  emitFile () {
    // 数据渲染到output目录下
    let main = path.join(this.config.output.path, this.config.output.filename)
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules
    })
    this.assets = {}
    // 资源中 路径对应的代码
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }

  run () {
    this.hooks.run.call()
    // 执行 并创建模块的依赖关系
    this.hooks.compile.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    // 发射文件
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}

module.exports = Compiler
