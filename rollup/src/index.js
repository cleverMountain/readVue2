import compileToFunction from "./compiler/index.js";
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





/**
 * 
 */
//  const vm1 = new Vue({
//   data() {
//     return {
//       name: 'aaa'
//     }
//   }
// }) 
// const vm2 = new Vue({
//   data() {
//     return {
//       age: 'aaa'
//     }
//   }
// }) 
// let render1 =  compileToFunction(`<div key=1>{{name}}</div>`)
// let vnode1 =  render1.call(vm1)
// let render2 = compileToFunction(`<h1 key=2>{{age}}32</h1>`)
// let vnode2 =  render2.call(vm2)

// console.log(vnode2)
export default Vue