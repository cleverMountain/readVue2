import initState from "./state"
import compileToFunction from "./compiler/index"
import { mountComponent } from "./lifecycle"

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 指向Vue构造函数
    const vm = this
    vm.$options = options
    initState(vm)
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
      // 转化成render函数
      const render = compileToFunction(template)
      opts.render = render
      // vm.render =  mountComponent.bind(vm, vm, vm.$el)
    }
    mountComponent(vm, el) // 组件挂载
  }
}

export { initMixin }