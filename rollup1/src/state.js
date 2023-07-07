import { observe } from "./observe/index"

function initState(vm) {
  // console.log(vm)
  // debugger
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }

}

function initData(vm) {
  let data = vm.$options.data
  // data是函数或者对象
  data = typeof data === 'function' ? data.call(vm) : data || {}
  // 将data挂在到vm上
  vm._data = data
  // 对_data进行代理 vm. = vm._data.
  proxy(vm, "_data");
  // 监听
  observe(data)

}


function proxy (vm, prop) {
  const data = vm._data
  for (let key in data) {
    Object.defineProperty(vm, key, {
      get () {
        return vm[prop][key]
      },
      set (newVal) {
        if (vm[prop][key] === newVal) return
        vm[prop][key] = newVal
      }
    })
  }
}
export default initState