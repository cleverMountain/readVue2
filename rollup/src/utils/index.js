import { nextTick } from "./nextTick"
import { watch } from "./watch"


function initUtils(Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype.$watch = watch
}

export default initUtils