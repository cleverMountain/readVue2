export default function set(target, key, val) {
  
  // 修改数组
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    // 调用修改的splice方法
    target.splice(key, 1, val);
    return val
  }
  // 修改对象
  if (key in target && !(key in Object.prototype)) {
    
    target[key] = val;
    return val
  }


}