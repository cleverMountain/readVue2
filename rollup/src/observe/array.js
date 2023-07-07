// 重写数组中的部分方法
const oldArrayProto = Array.prototype
const newArrayProto = Object.create(oldArrayProto);

// 所有的编译方法，修改原数组组
var methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];
methods.forEach(method => {
  // 重写数组方法
  newArrayProto[method] = function (...args) {
    let ob = this.__ob__
    // 用于劫持数组增加的对象参数
    let insert
    switch (method) {
      case 'push':
      case 'unshift':
        insert = args
        break
      case 'splice': // arr.splice(1, 1, {a, 1}, {b: 2})
        insert = args.slice(2)
        break
      default:
        break
    }
    if (insert) {
    
      ob.observeArray(insert)
    }
    // 内部调用原来方法
    const result = oldArrayProto[method].call(this, ...args)
   console.log(ob)
    ob.dep.notify()
    return result
  }
})

export { newArrayProto }