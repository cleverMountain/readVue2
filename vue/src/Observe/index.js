import { arrayMethods } from "./array.js"
import { Dep } from "./dep.js"


function Observer(value) {
  // 给每一个value添加一个依赖
  this.dep = new Dep();
  this.value = value;
  // 给每一个value添加__ob__，__ob就是Observer
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
 
    // value.__proto__ = arrayMethods
    // 调用重写的方法,push，pop等，会触发监听
    protoAugment(value, arrayMethods);
    // 首次加载，如果数组某项的值是原始值，直接就把值放上去了
    this.observeArray(value);
  } else {
    // 对象时
    this.walk(value);
  }
};

Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};


Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    // 直接就返回值了
    observe(items[i]);
  }
};


function observe(value) {
  debugger
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


function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

function defineReactive(obj, key, val) {
  // 递归劫持对象数据

  let childOb = observe(val);

  let dep = new Dep(); // 根据源码将dep 存放起来
  /**
   * console.log(Dep.target) 
   * 在beforeCreate与created之间
   * 对数据做了劫持
   * Dep.target = null
   */
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      /**
       * Watcher.prototype.get => getter.call(vm, vm)
       * 调用render函数时_s()会触发get函数
       * popTarget()调用完毕,Dep.target === null
       * new Watcher(vm, updateComponent, function () { }, {});
       * beforeMount与mounted之间
       */
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          // if (Array.isArray(val)) {
          //   dependArray(val);
          // }
        }
      }
      return val
    },
    set: function reactiveSetter(newValue) {

      if (newValue == val) return;
      observe(newValue) //如果用户将值改为对象继续监控
      val = newValue
      dep.notify()

    }
  });
}
function protoAugment(target, src) {
  target.__proto__ = src;
}









export { observe }