import set from "./set.js"
import del from "./delete.js"
import { nextTick } from "./nextTick.js"
import { watch } from "./watch.js"

function stateMixin(Vue) {
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };
  Vue.prototype.$watch = watch  // 初始化watch
}

export { stateMixin }