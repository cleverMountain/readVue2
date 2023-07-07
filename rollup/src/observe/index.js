import { newArrayProto } from "./array"
import Dep from "./dep"

class Observe {
  constructor(data) {
    this.dep = new Dep() // 对整个对象和数组添加dep
    // _ob__不可枚举
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      value: this
    })
    // Object.defineProperty()只能劫持已经存在的数据
    if (Array.isArray(data)) {
   
      // 重写数组方法,这样有问题，保留数组方法重写某一些方法
      // data.__proto__ = {
      //   push () {
      //     debugger
      //   },
      // }
      // // 把类的方法添加到数组上observeArray
      // data.__ob__ = this
      // 重写数组
      data.__proto__ = newArrayProto
      // 数组
      this.observeArray(data)
    } else {
      // 对象
      this.walk(data)
    }
  }
  walk(data) {
    // var keys = Object.keys(data);
    // for (var i = 0; i < keys.length; i++) {
    //   defineReactive(obj, keys[i], obj[keys[i]]);
    // }
    // console.log(this)
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    // [1, 2, {a: 1}]对数组中对象进行劫持
    data.forEach(item => observe(item))
  }
}

function observe(data) {
  // console.log(data)
  // 如果是原始值直接就返回值了
  if (typeof data !== 'object' || data == null) {
  
    return
  }
  // //判断用户是否已经观测
  if (data.__ob__ instanceof Observe) {
    return data.__ob__;
  }
  // console.log(this)
  return new Observe(data)
}

function defineReactive(data, key, value) {
 
  // console.log(value)
  let childOb =  observe(value) //  
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      
      if (Dep.target) {
        dep.depend() // 收集依赖属性
        if(childOb) {
          childOb.dep.depend() // 数组和对象本身也实现依赖收集
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return
      value = newValue
      dep.notify() // 更新视图
    }
  })
}
export { observe }