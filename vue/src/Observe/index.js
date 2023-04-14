import { Observer } from "./Observer.js"

function observe(value) {
  
  if (typeof value !== 'object' || value == null) {
    return;
  }
  //判断用户是否已经观测
  if (value.__ob__) {
    return value;
  }


  return new Observer(value);

}


export { observe }