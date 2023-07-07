import Watcher from "../observe/watcher";

function initWatch(vm, watch) {
  for (let key in watch) {
    const handler = watch[key]
    createWatcher(vm, key, handler)
  }
}

function createWatcher(
  vm,
  expOrFn,
  handler,
  options
) {
  if (Object.prototype.toString.call(handler) === '[object Object]') {
    options = handler;
    handler = handler.handler;
  }
  // if (typeof handler === 'string') {
  //   handler = vm[handler];
  // }
  return vm.$watch(expOrFn, handler, options)
}

function watch(expOrFn, cb, options) {

  const vm = this
  options = options || {};
  options.user = true;

  let watcher = new Watcher(vm, expOrFn, options, cb);
  return () => {

    watcher.teardown()
  }
}

export { initWatch, watch }