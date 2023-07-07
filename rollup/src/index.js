import { initMixin } from "./init.js"
import { initlifeCycle } from "./lifecycle.js";
import initUtils from "./utils/index.js";

function Vue(options) {
  // 2.初始化选项，执行_init函数
  this._init(options);
}

initMixin(Vue)
initlifeCycle(Vue)
initUtils(Vue)

export default Vue