import set from "./set.js"
import del from "./delete.js"

function stateMixin(Vue) {
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
}

export { stateMixin }