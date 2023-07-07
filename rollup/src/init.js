import { mountComponent } from "./lifecycle";
import  compileToFunction from "./compiler/index";
import initState from "./state.js"

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(vm);
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