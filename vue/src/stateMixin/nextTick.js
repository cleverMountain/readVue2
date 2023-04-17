/**
 * 1.update时调用queueWatcher函数。 queueWatcher(Watcher)
 * 2.执行queueWatcher，把Watcher放进队列中。 =>queue.push(watcher)
 * 3.执行nextTick(flushSchedulerQueue)
 * 4.callbacks.push(cb.bind(ctx))，把刷新队列函数flushSchedulerQueue放进callbacks里
 * 5.当更新多个数据执行update时，重复上述步骤，收集所有依赖相关的flushSchedulerQueue到callbacks里
 * 6.调用异步函数Promise.resolve().then(flushCallbacks)，执行所有callbacks里的函数
 * 7.调用watcher.run()更新视图
 */

var callbacks = [];
var pending = false;

function flushCallbacks() {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// timerFunc不做兼容处理，为Promise
var timerFunc = function () {
  Promise.resolve().then(flushCallbacks);
};




function nextTick(cb, ctx) {
  callbacks.push(function () {
    cb.call(ctx);
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
}



function queueWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      nextTick(flushSchedulerQueue);
    }
  }
}

var currentFlushTimestamp = 0;
var getNow = Date.now;
var queue = [];
var has = {};
var waiting = false;
var flushing = false;
var index = 0;
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;
  queue.sort(function (a, b) { return a.id - b.id; });
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }
}

export { nextTick, queueWatcher }