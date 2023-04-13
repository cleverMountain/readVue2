import Vue from "../index.js";
import { callHook } from "../lifeCycle/index.js"
import { initState } from "./initStatus.js";
import { compileToFunction } from "../compiler/index.js"
import { mountComponent } from "../lifeCycle/index.js"
import { mergeOptions } from "../lifeCycle/utils.js"

function initMixin(Vue) {
  Vue.prototype._init = function (options) {

    var vm = this;
    vm.$options = mergeOptions({}, options)
    // beforeCreate只有Vue实例
    callHook(vm, "beforeCreate")
    initState(vm);
    // 方法和data已经被初始化了
    callHook(vm, "created")
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }

  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options
    el = document.querySelector(el);
    vm.$el = el

    /**
     * 优先级
     * 1.有render就先渲染render
     * 2.有template就渲染template
     * 3.最后有el再渲染el
     */
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      //获取到元素(template模块)，将元素转换成render
      const render = compileToFunction(template)
      options.render = render
      console.log(options)
    }
    mountComponent(vm, el)
  }
}


export { initMixin }