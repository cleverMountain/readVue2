import Watcher from "../Observe/watcher.js"
import {
  pushTarget,
  popTarget
} from "../Observe/dep.js"

// 创建watch
function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {

      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(
  vm,
  expOrFn,
  handler,
  options
) {
  // 判断option是否是对象，immeadiate， deep
  if (Object.prototype.toString.call(handler) === '[object Object]') {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  // 调用原型上的watch
  return vm.$watch(expOrFn, handler, options)
}

function watch(
  expOrFn,
  cb,
  options
) {

  var vm = this;

  options = options || {};
  options.user = true;
  var watcher = new Watcher(vm, expOrFn, cb, options);
  console.log(watcher.value)
  debugger
  if (options.immediate) {
    var info = "callback for immediate watcher \"" + (watcher.expression) + "\"";
    pushTarget();
    invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
    popTarget();
  }
  return function unwatchFn() {
    watcher.teardown();
  }
};


export { initWatch, watch }