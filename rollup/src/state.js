import { observe } from "./observe/index.js"
import initComputed from "./utils/computed.js"
import { initWatch } from "./utils/watch.js"

function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}
// 数据代理
function proxy(vm, key, data) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]
    },
    set(newValue) {
      if (newValue === vm[data][key]) return
      vm[data][key] = newValue
    }
  })
}
function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(this) : data
  // 将data放在_data上
  vm._data = data
  // 数据劫持
  observe(data)
  // 数据代理，将_data代理vm上
  for (let key in data) {
    proxy(vm, key, '_data')
  }
}

export default initState