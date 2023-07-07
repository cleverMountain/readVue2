import { createElementVNode, createText } from "./vnode/index"
import { patch } from "./patch/index"
import Watcher from "./observe/watcher"


function initlifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
   
    const vm = this

    const el = vm.$el

    vm.$el = patch(el, vnode)

  },
    Vue.prototype._render = function () {
      const vm = this
      const vnode = vm.$options.render.call(vm)
      return vnode

    },
    Vue.prototype._c = function () {
      // 创建标签
      return createElementVNode(...arguments)

    }
  Vue.prototype._s = function (value) {
    return value
  }
  Vue.prototype._v = function () {
    return createText(...arguments)
  }
}

function mountComponent(vm, el) {

  vm.$el = el
  
  // vm._render()，将render函数变成虚拟dom
  // // vm_update将虚拟dom变成真实dom
  let updateComponent = () => {
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, true)
}


export { mountComponent, initlifeCycle }