import { Observer } from "./Observer.js"

function observe(value) {
  // 如果是原始值直接就返回值了
  if (typeof value !== 'object' || value == null) {
    return;
  }
  //判断用户是否已经观测
  if (value.__ob__) {
    return value;
  }

  // 如果是对象则再进行监听
  return new Observer(value);

}


export { observe }