class SyncLoopHook {
  constructor (args) {
    this.args = args
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    args = args.slice(0, this.args.length)
    this.tasks.forEach(task => {
      let res = ''
      do {
        res = task(...args)
      } while (res === true || !(res === undefined))
    })
  }
}
let total = 0

let syncLoopHook = new SyncLoopHook(['name', 'age'])
// 只有第一个事件处理函数的参数可以通过 call 传递
syncLoopHook.tap('1', function (name, age) {
  console.log('1', name, age)
  // return '1'
})
syncLoopHook.tap('2', (name, age) => {
  console.log('2', name, age)
  return total++ < 2 ? true : undefined
})
syncLoopHook.tap('3', data => {
  console.log('3', data)
})
syncLoopHook.call('ppya', '18')
