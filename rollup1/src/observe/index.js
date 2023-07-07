import arrayMethods from "./array"
import Dep from "./dep"

class Observe {
  constructor(value) {
    // 设置监听属性判断是否已经被劫持
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this,
    })
    
    if (Array.isArray(value)) {
      // 重写数组方法
      value.__proto__ = arrayMethods
      // arrayMethods.observeArray = this.observeArray
      // 数组
      this.observeArray(value)
    } else {
      // 对象
      this.walk(value)
    }
  }
  
  walk (value) {
    Object.keys(value).forEach(item => defineReactive(value, item, value[item]))
  }
  observeArray (value) {
 
    // value.forEach(item => observe(item))
    for (let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
}

function observe(value) {
  // 如果是原始值直接就返回值了
  if (typeof value !== 'object' || value == null) {
    return;
  }
  if (value.__Ob__ instanceof Observe) {
    return value.__Ob__
  }
  const ob = new Observe(value)
}

function defineReactive(data, key, value) {
  observe(value)
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get () {
    
      // 每个dep里有许多watcher，watcher里面有更新视图的功能函数
      dep.depend()
      return value
    },
    set (newValue) {
   
      // 当数据改变时，通知改变
      dep.notify()
      value = newValue
    }
  })
}

export { observe }