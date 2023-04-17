import { patch } from "../vnode/patch.js"
import Watcher  from "../Observe/watcher.js"

function mountComponent(vm, el) {
  // 
  callHook(vm, 'beforeMount');
  // const vnode = vm._render()
  // console.log(vnode)
  let updateComponent = function () {

    vm._update(vm._render())

  };
  // 参数vm 渲染函数 cb options
  // 一个模板一个Watcher
  new Watcher(vm, updateComponent, function () { }, {});

  // dom已经挂在了
  callHook(vm, 'mounted');
}



// 调用生命周期函数，执行生命周期中的回调函数
function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}
// 混入生命周期
function lifecycleMixin(Vue) {
  // 简化版
  Vue.prototype._update = function (vnode) {

    // 虚拟dom，通过patch将询idom转化为真实dom
    // 通过比较新旧dom
    const vm = this
    let prevVnode = vm.$el
    vm.$el = patch(prevVnode, vnode);
  };
  /**
   * $forceUpdate $destroy
   */

}

export { mountComponent, callHook, lifecycleMixin }