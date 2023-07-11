import { callHook, mountComponent } from "./lifecycle";
import  compileToFunction from "./compiler/index";
import initState from "./state.js"
import mergeOptions from "./utils/mergeOptions";

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // 合并参数
    vm.$options = mergeOptions(this.constructor.options, options)
    // 状态初始化之前钩子
    callHook(vm, 'beforeCreated')
    initState(vm);
    // 已经初始化状态了
    callHook(vm, 'created')
    if (options.el) {
      vm.$mount(options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    let vm = this,
      opts = vm.$options,
      template
    el = document.querySelector(el)
    if (!opts.render) {
      if (!opts.template && el) {
        template = el.outerHTML
      } else {
        template = opts.template
      }
    } else {
      template = opts.render
    }
    if (template) {
      const render = compileToFunction(template)
      opts.render = render
 
    }
    mountComponent(vm, el) // 组件挂载
  }
}


export { initMixin }