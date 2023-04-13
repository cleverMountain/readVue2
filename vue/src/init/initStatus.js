import { observe } from "../Observe/index.js"
import {callHook} from "../lifeCycle/index.js"

function initState(vm) {
  console.log(vm)
  const opts = vm.$options;
  // beforeCreate只有Vue实例
  callHook(vm, "beforeCreate")
  // 初始化方法
  initMethods(vm, opts.methods)
  // 初始化data
  initData(vm);
  // 方法和data已经被初始化了
  callHook(vm, "created")
}

function initMethods(vm, methods) {
  // 把方法挂载到vue上,可以使用this.来调用
  for (let key in methods) {
    vm[key] = methods[key].bind(vm)
  }
}
function initData(vm) {
  let data = vm.$options.data
  // 判断data是否是函数
  if (typeof data === 'function') {
    vm._data = data.call(vm)
  } else {
    vm._data = data
  }
  // 对data进行代理,可以使用this.来调用
  proxyDeep(vm, vm._data, '_data')
  // 观察data
  observe(data)
}



function proxyDeep(vm, data, dataKey) {
  for (let key in data) {
    const value = data[key]
    if (typeof value === 'object' && value !== null) {
      proxy(vm, dataKey, key)
    } else {
      proxy(vm, dataKey, key)
    }

  }
}

function proxy(vm, data, key) {

  // Object.defineProperty(vm, key, descriptor)
  let descriptor = {
    enumerable: true,
    configurable: true,
    get: function () { },
    set: function () { }
  }
  descriptor.set = function get(val) {
    vm[data][key] = val
  }
  descriptor.get = function get() {
    return vm[data][key]
  }
  Object.defineProperty(vm, key, descriptor)
}
export { initState }