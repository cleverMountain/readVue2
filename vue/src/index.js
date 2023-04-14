
import { initMixin } from "./init/init.js";
import { lifecycleMixin } from "./lifeCycle/index.js"
import { renderMixin } from "./vnode/index.js"

function Vue(options) {

  // 2.初始化选项，执行_init函数
  this._init(options);
}


initMixin(Vue);
lifecycleMixin(Vue) // 混入生命周期_update
renderMixin(Vue) // 混入render函数
export default Vue