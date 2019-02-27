class SyncWaterFallHook {
  constructor (args) {
    this.args = args
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    args = args.slice(0, this.args.length)
    let [first, ...others] = this.tasks
    return others.reduce((res, task) => task(res), first(...args))
  }
}

let syncWaterFallHook = new SyncWaterFallHook(['name', 'age'])
// 只有第一个事件处理函数的参数可以通过 call 传递
syncWaterFallHook.tap('1', function (name, age) {
  console.log('1', name, age)
  // return '1'
})
syncWaterFallHook.tap('2', (...args) => {
  console.log('2', args)
  return '2'
})
syncWaterFallHook.tap('3', data => {
  console.log('3', data)
  return '3'
})
syncWaterFallHook.call('ppya', '18')
