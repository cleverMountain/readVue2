import { createElementVNode, createTextVNode } from "./vnode/index"
import { patch } from "./vnode/patch"
import Watcher from "./observe/watcher"


function initlifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {

    const vm = this

    const el = vm.$el

    vm.$el = patch(el, vnode)
    callHook(vm, 'mounted')    
  },
    Vue.prototype._render = function () {
      const vm = this
      const vnode = vm.$options.render.call(vm)
      return vnode

    },
    Vue.prototype._c = function () {
      // 创建标签y
      const vm = this
      return createElementVNode.call(vm, ...arguments)

    }
  Vue.prototype._s = function (value) {
    return value
  }
  Vue.prototype._v = function () {
    const vm = this
    return createTextVNode.call(vm, ...arguments)
  }
}

function mountComponent(vm, el) {
  callHook(vm, 'beforeMount')
  vm.$el = el
  
  // vm._render()，将render函数变成虚拟dom
  // // vm_update将虚拟dom变成真实dom
  const undateComponent = () => {
    vm._update(vm._render())
  }
 
  new Watcher(vm, () => {
    undateComponent()
  }, true)
}



function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => {
      handler.call(vm)
    })
  }
}
export { mountComponent, initlifeCycle, callHook }