#!/usr/bin/env node
const path = require('path')
// config配置文件
const config = require(path.resolve('./webpack.config.js'))
const Compiler = require(path.resolve('./ppya-webpack/lib/Compiler.js'))
const compiler = new Compiler(config)
compiler.hooks.entryOption.call()
// 编译
compiler.run()
