class SyncHook {
  constructor (args) {
    this.args = args
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    this.tasks.forEach(task => task(...args))
  }
}

let syncHook = new SyncHook(['name'])
syncHook.tap('node', function (name) {
  console.log('node', name)
})
syncHook.call('ppya')
