export default function del(target, key) {
  // 删除数组属性
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  // 没有则不删除
  if (!hasOwn(target, key)) {
    return
  }
  // 删除对象属性 
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
