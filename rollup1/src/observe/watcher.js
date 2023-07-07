import Dep from "./dep"


let id = 0
class Watcher {
  constructor(vm, fn, boolean) {
    this.id = id++
    this.getter = fn
    this.deps = []
    this.depIds = new Set()
    this.get()
  }
  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }
  addDep(dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  update() {
    // console.log('update')
    // this.getter()
    handleQueue(this)
  }
  run() {
    console.log('update')
    this.getter()
  }
}

let queue = []
let pending = false
let has = {}
function fluseQueue () {
  let nowQueue = queue.slice(0)
  queue = []
  pending = false
  nowQueue.forEach(watcher => watcher.run())
}
function handleQueue(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      setTimeout(fluseQueue)
      pending = true
    }
  }
}

export default Watcher
