import { initMixin } from "./init"
import  {initlifeCycle} from "./lifecycle"

function Vue(options) {
  // 调用原型上的方法，但是this指向的是构造函数Vue
  this._init(options);
}

initMixin(Vue)
initlifeCycle(Vue)

export default Vue