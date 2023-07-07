const originMethods = Array.prototype
const arrayMethods = Object.create(originMethods) // originMethods最为对象原型
// console.log(arrayMethods)
const rewriteMethods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'] // 会改变原数组的方法

rewriteMethods.forEach(mehtod => {
  arrayMethods[mehtod] = function (...argues) {
    // 如果当前被改变的数组是对象，则需要对对象进行劫持
    let insert
    switch (mehtod) {
      case 'push':
      case 'unshift':
        insert = argues
        break
      case 'splice':
        insert = argues.slice(2)
        break
    }
    if (insert) {
      this.__ob__.observeArray(insert)
    }

    // 调用以前的方法
    let result =  originMethods[mehtod].call(this, ...argues)
    return result
  }
})

export default arrayMethods