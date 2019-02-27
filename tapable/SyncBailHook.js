class SyncBailHook {
  constructor (args) {
    this.args = args
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    args = args.slice(0, this.args.length)
    let i = 0
    let res = ''
    do {
      res = this.tasks[i++](...args)
    } while (!res)
  }
}

let syncBailHook = new SyncBailHook(['name', 'age'])
syncBailHook.tap('1', function (name) {
  console.log('1', name)
})
syncBailHook.tap('2', function (name, age) {
  console.log('2', name, age)
  return '2'
})
syncBailHook.tap('3', function (name, age) {
  console.log('3', name, age)
})
syncBailHook.call('ppya', '18')
