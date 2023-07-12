import mergeOptions from "./utils/mergeOptions"

export default function initGlobalAPI(Vue) {
  Vue.options = {
    _base: Vue
  }
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this.options
  }
  Vue.extend = function (options) {
    // console.log(options)
    function Sub(options = {}) {
      // console.log(Vue.options, Sub.options)
      // debugger
      this._init(options)
    }
    Sub.options = mergeOptions(Vue.options, options)
    Sub.prototype = Vue.prototype
    Sub.prototype.constructor = Sub
    return Sub
  }
  Vue.options.components = {}
  Vue.component = function (idName, definetion) {

    definetion = typeof definetion === 'function' ? definetion : Vue.extend(definetion)
    Vue.options.components[idName] = definetion
    // console.log(Vue.options.components)
  }
}



