
import { initMixin } from "./init/init.js";


function Vue(options) {

  // 2.初始化选项，执行_init函数
  this._init(options);
}


initMixin(Vue);

export default Vue