class AsyncParallelHook {
  constructor (args) {
    this.args = args
    this.tasks = []
  }
  tapAsync (name, task) {
    this.tasks.push(task)
  }
  callAsync (...args) {
    let finalCallback = args.pop()
    args = args.slice(0, this.args.length)
    let i = 0
    let done = () => {
      if (++i === this.tasks.length) {
        finalCallback()
      }
    }
    // 依次执行事件处理函数
    this.tasks.forEach(task => task(...args, done))
  }
}

let syncWaterFallHook = new AsyncParallelHook(['name', 'age'])
console.time('time')
syncWaterFallHook.tapAsync('1', function (name, age, done) {
  setTimeout(() => {
    console.log('1', name, age, new Date())
    done()
  }, 1000)
})
syncWaterFallHook.tapAsync('2', function (name, age, done) {
  setTimeout(() => {
    console.log('2', name, age, new Date())
    done()
  }, 2000)
})
syncWaterFallHook.tapAsync('3', function (name, age, done) {
  setTimeout(() => {
    console.log('3', name, age, new Date())
    done()
    console.timeEnd('time')
  }, 3000)
})
syncWaterFallHook.callAsync('ppya', '18', () => {
  console.log('complete')
})
