let { SyncHook, SyncBailHook, SyncWaterfallHook, AsyncParallelHook } = require('tapable')
class Cat {
  constructor () {
    this.hooks = {
      mouse: new SyncHook(['name'])
    }
  }
  tap () {
    this.hooks.mouse.tap('node', function (name) {
      console.log('node', name)
    })
  }
  start () {
    this.hooks.mouse.call('ppya')
  }
}

let cat = new Cat()
// cat.tap()
// cat.start()

// const mouse = new SyncHook(['name'])
// mouse.tap('node', function (name) {
//   console.log('node', name)
// })
// mouse.call('ppya')

class BailCat {
  constructor () {
    this.hooks = {
      mouse: new SyncBailHook(['name', 'age'])
    }
  }
  tap () {
    this.hooks.mouse.tap('1', function (...args) {
      console.log('1', args)
    })
    this.hooks.mouse.tap('2', function (name, age) {
      console.log('2', name, age)
      return '2'
    })
    this.hooks.mouse.tap('3', function (name, age) {
      console.log('3', name, age)
    })
  }
  start () {
    this.hooks.mouse.call('ppya', '18')
  }
}

let bailCat = new BailCat()
// bailCat.tap()
// bailCat.start()

/* --------------------------- */
class SyncWaterFallCat {
  constructor () {
    this.hooks = {
      mouse: new SyncWaterfallHook(['name', 'age'])
    }
  }
  tap () {
    // 只有第一个事件处理函数的参数可以通过 call 传递
    this.hooks.mouse.tap('1', function (name, age) {
      console.log('1', name, age)
      // return '1'
    })
    this.hooks.mouse.tap('2', (...args) => {
      console.log('2', args)
      return '2'
    })
    this.hooks.mouse.tap('3', data => {
      console.log('3', data)
      return '3'
    })
  }
  start () {
    const res = this.hooks.mouse.call('ppya', '18')
    console.log('start res', res)
  }
}

let syncWaterFallCat = new SyncWaterFallCat()
// syncWaterFallCat.tap()
// syncWaterFallCat.start()

/* --------------------------- */
class AsyncParallelHookCat {
  constructor () {
    this.hooks = {
      mouse: new AsyncParallelHook(['name', 'age'])
    }
  }
  tap () {
    console.time('time')
    this.hooks.mouse.tapAsync('1', function (name, age, done) {
      setTimeout(() => {
        console.log('1', name, age, new Date())
        done()
      }, 1000)
    })
    this.hooks.mouse.tapAsync('2', function (name, age, done) {
      setTimeout(() => {
        console.log('2', name, age, new Date())
        done()
      }, 2000)
    })
    this.hooks.mouse.tapAsync('3', function (name, age, done) {
      setTimeout(() => {
        console.log('3', name, age, new Date())
        done()
        console.timeEnd('time')
      }, 3000)
    })
  }
  start () {
    this.hooks.mouse.callAsync('ppya', '18', () => {
      console.log('complete')
    })
  }
}
let ayncParallelHookCat = new AsyncParallelHookCat()
ayncParallelHookCat.tap()
ayncParallelHookCat.start()
