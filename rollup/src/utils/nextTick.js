let queue = [] // watcher队列
let has = {} // watcher的id集合
let pending = false // 是否继续处理queue

function fluseQueue() {
  let nowQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  nowQueue.forEach(watcher => watcher.run())
}
// 异步更新的机制：同步添加watcher到队列中，异步遍历队列进行刷新
// 事件环：同步任务与异步任务进入主线程，主线程遇到同步任务则执行，遇到异步
// 任务则放进任务队列中，当同步任务执行完毕，任务队列会将异步任务推进主线程
// 再执行异步任务

/**
 * 多次执行变成一次执行,pending状态，数组队列
 */
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      nextTick(fluseQueue)
      pending = true
    }

  }
}


let cbs = []
let waiting = false
// 异步事件的兼容写法
function timerFunc (cb) {
  if (window.Promise) {
    Promise.resolve().then(() => cb())
  } else if (window.MutationObserver) {
    new MutationObserver(cb())
  } else if (window.setImmediate) {
    setImmediate(cb())
  } else {
    setTimeout(cb())
  }
}
function flushCallbacks() {
  let callbacks = cbs.slice(0)
  cbs = []
  waiting = false
  callbacks.forEach(cb => cb())
}

function nextTick(cb) {
  // 收集回调函数
  cbs.push(cb)
  if (!waiting) {
    // 一次更新
    timerFunc(flushCallbacks)
    waiting = true
  }

}

export { nextTick, queueWatcher }