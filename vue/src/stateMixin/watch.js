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
  // debugger
  // 新建一个watcher
  var watcher = new Watcher(vm, expOrFn, cb, options);
  console.log(watcher.value)
  // immediate 立即触发
  if (options.immediate) {
    var info = "callback for immediate watcher";
    pushTarget();
    // 触发watcher的函数  [watcher.value] 参数是数组
    invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
    popTarget();
  }
  return function unwatchFn() {
    debugger
    watcher.teardown();
  }
};



function invokeWithErrorHandling(
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    // watch的回调函数
    res = args ? handler.apply(context, args) : handler.call(context);


    let a = handler()

    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

export { initWatch, watch, invokeWithErrorHandling }