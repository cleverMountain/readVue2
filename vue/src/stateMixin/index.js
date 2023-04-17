import set from "./set.js"
import del from "./delete.js"
import { nextTick } from "./nextTick.js"

function stateMixin(Vue) {
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };
}

export { stateMixin }